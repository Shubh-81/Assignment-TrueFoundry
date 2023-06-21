import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-github';
import { ConfigService } from '@nestjs/config';
import { Octokit } from '@octokit/rest';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  private octokit: Octokit;

  constructor(private readonly configService: ConfigService) {
    super({
      clientID: configService.get('GITHUB_CLIENT_ID'),
      clientSecret: configService.get('GITHUB_CLIENT_SECRET'),
      callbackURL: configService.get('GITHUB_CALLBACK_URL'),
    });

    const githubAccessToken = configService.get('GITHUB_ACCESS_TOKEN');
    this.octokit = new Octokit({
      auth: `token ${githubAccessToken}`,
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any) {
    const { username } = profile;

    try {
      const repoName = 'sample-repo';
      const file1 = {
        path: 'file1.txt',
        content: 'Sample content for file 1',
      };
      const file2 = {
        path: 'file2.txt',
        content: 'Sample content for file 2',
      };

      // Create a new repository
      const { data: createdRepo } = await this.octokit.repos.createForAuthenticatedUser({
        name: repoName,
        private: false,
      });

      // Add files to the repository
      await this.octokit.repos.createOrUpdateFileContents({
        owner: username,
        repo: repoName,
        path: file1.path,
        message: 'Add file 1',
        content: Buffer.from(file1.content).toString('base64'),
      });

      await this.octokit.repos.createOrUpdateFileContents({
        owner: username,
        repo: repoName,
        path: file2.path,
        message: 'Add file 2',
        content: Buffer.from(file2.content).toString('base64'),
      });

      // Return relevant data or customize the response as needed
      return {
        message: 'Repository created and files added successfully',
        repository: createdRepo,
      };
    } catch (error) {
      // Handle any errors that occurred during the process
      console.error('Error creating repository and adding files:', error);
      throw error;
    }
  }
}

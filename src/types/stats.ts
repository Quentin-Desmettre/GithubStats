export type LanguagesContributions = {
  totalBytes: number;
  data: {
    [key: string]: {
      bytes: number;
      percentage: number;
      color: string;
    };
  };
};

export type UserData = {
  totalCommits: number;
  totalPullRequests: number;
  totalReviews: number;
  totalIssues: number;
  languages: LanguagesContributions;
  repositories: {
    [key: string]: {
      createdAt: string;
      updatedAt: string;
      openGraphImageUrl: string;
      stars: number;
      languages: LanguagesContributions;
    };
  };
};

type RepositoryData = {
  repository: {
    stargazerCount: number;
    nameWithOwner: string;
    createdAt: string;
    updatedAt: string;
    openGraphImageUrl: string;
    languages: {
      totalCount: number;
      edges: {
        size: number;
        node: {
          color: string;
          name: string;
        };
      }[];
    };
  };
};

export type Contributions = {
  totalCommitContributions: number;
  totalIssueContributions: number;
  totalPullRequestContributions: number;
  totalPullRequestReviewContributions: number;
  commitContributionsByRepository: RepositoryData[];
  issueContributionsByRepository: RepositoryData[];
  pullRequestContributionsByRepository: RepositoryData[];
  pullRequestReviewContributionsByRepository: RepositoryData[];
};

export type RawContributionsAnswer = {
  data:
    | {
        user: {
          contributionsCollection: Contributions;
        };
      }
    | undefined;
};

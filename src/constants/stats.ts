import { UserData } from '@/types/stats';

const defaultStats: UserData = {
  totalCommits: 0,
  totalPullRequests: 0,
  totalReviews: 0,
  totalIssues: 0,
  languages: {
    totalBytes: 0,
    data: {},
  },
  repositories: {},
};

export default {
  defaultStats,
};

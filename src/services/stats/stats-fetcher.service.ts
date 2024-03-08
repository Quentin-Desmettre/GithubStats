import { Injectable } from '@nestjs/common';

import { Contributions, RawCalendarAnswer, RawContributionsAnswer } from '@/types/stats';

@Injectable()
export class StatsFetcherService {
  async getRawCalendar(token: string, username: string, from: Date, to: Date): Promise<RawCalendarAnswer> {
    const headers = {
      Authorization: `bearer ${token}`,
    };
    const body = {
      query: `query {
        user(login: "${username}") {
          contributionsCollection(from: "${from.toISOString()}", to: "${to.toISOString()}") {
            contributionCalendar {
              totalContributions
              weeks {
                contributionDays {
                  contributionCount
                  date
                }
              }
            }
          }
        }
      }`,
    };
    const response = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      body: JSON.stringify(body),
      headers: headers,
    });
    return await response.json();
  }

  async getRawContributions(token: string, username: string, from: Date, to: Date): Promise<RawContributionsAnswer> {
    const headers = {
      Authorization: `bearer ${token}`,
    };
    const body = {
      query: `query {
        user(login: "${username}") {
          contributionsCollection(from: "${from.toISOString()}", to: "${to.toISOString()}") {
            totalCommitContributions
            totalIssueContributions
            totalPullRequestContributions
            totalPullRequestReviewContributions

            commitContributionsByRepository(maxRepositories: 100) {
              repository {
                stargazerCount
                nameWithOwner
                createdAt
                updatedAt
                openGraphImageUrl
                languages(last: 100) {
                  totalCount
                  edges {
                    size
                    node {
                      color
                      name
                    }
                  }
                }
              }
            }

            issueContributionsByRepository(maxRepositories: 100) {
              repository {
                stargazerCount
                nameWithOwner
                createdAt
                updatedAt
                openGraphImageUrl
                languages(last: 100) {
                  totalCount
                  edges {
                    size
                    node {
                      color
                      name
                    }
                  }
                }
              }
            }

            pullRequestContributionsByRepository(maxRepositories: 100) {
              repository {
                stargazerCount
                nameWithOwner
                createdAt
                updatedAt
                openGraphImageUrl
                languages(last: 100) {
                  totalCount
                  edges {
                    size
                    node {
                      color
                      name
                    }
                  }
                }
              }
            }

            pullRequestReviewContributionsByRepository(maxRepositories: 100) {
              repository {
                stargazerCount
                nameWithOwner
                createdAt
                updatedAt
                openGraphImageUrl
                languages(last: 100) {
                  totalCount
                  edges {
                    size
                    node {
                      color
                      name
                    }
                  }
                }
              }
            }
          }
        }
      }`,
    };
    const response = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      body: JSON.stringify(body),
      headers: headers,
    });
    return await response.json();
  }

  async getContributions(token: string, username: string, from: Date, to: Date): Promise<Contributions | undefined> {
    const parsed = await this.getRawContributions(token, username, from, to);

    if (parsed.data === undefined || parsed.data.user === undefined) {
      return undefined;
    }
    return {
      ...parsed.data.user.contributionsCollection,
    };
  }
}

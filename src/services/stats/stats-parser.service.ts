import { Injectable } from '@nestjs/common';

import { Contributions, LanguagesContributions, UserData } from '@/types/stats';
import stats from '@/constants/stats';

@Injectable()
export class StatsParserService {
  private result: UserData = stats.defaultStats;
  constructor() {}

  private addToLanguages(base: LanguagesContributions, name: string, color: string, bytes: number): LanguagesContributions {
    if (base.data[name] === undefined) base.data[name] = { bytes: 0, percentage: 0, color: color };
    base.data[name].bytes += bytes;
    return base;
  }

  mergeContributions(contrib: Contributions): void {
    this.result.totalCommits += contrib.totalCommitContributions;
    this.result.totalPullRequests += contrib.totalPullRequestContributions;
    this.result.totalReviews += contrib.totalPullRequestReviewContributions;
    this.result.totalIssues += contrib.totalIssueContributions;
    contrib.commitContributionsByRepository.forEach(baseRepo => {
      const repo = baseRepo.repository;
      if (this.result.repositories[repo.nameWithOwner] === undefined) {
        this.result.repositories[repo.nameWithOwner] = {
          createdAt: repo.createdAt,
          updatedAt: repo.updatedAt,
          openGraphImageUrl: repo.openGraphImageUrl,
          stars: repo.stargazerCount,
          languages: {
            totalBytes: 0,
            data: {},
          },
        };
      }
      const repository = this.result.repositories[repo.nameWithOwner];
      repo.languages.edges.forEach(lang => {
        repository.languages = this.addToLanguages(repository.languages, lang.node.name, lang.node.color, lang.size);
        this.result.languages = this.addToLanguages(this.result.languages, lang.node.name, lang.node.color, lang.size);
      });
    });
  }

  computePercentagesAndTotalFor(languages: LanguagesContributions): LanguagesContributions {
    languages.totalBytes = 0;
    Object.keys(languages.data).forEach(key => {
      languages.totalBytes += languages.data[key].bytes;
    });
    Object.keys(languages.data).forEach(key => {
      languages.data[key].percentage = (languages.data[key].bytes / languages.totalBytes) * 100;
    });
    return languages;
  }

  computePercentagesAndTotal(): void {
    this.result.languages = this.computePercentagesAndTotalFor(this.result.languages);
    Object.keys(this.result.repositories).forEach(key => {
      this.result.repositories[key].languages = this.computePercentagesAndTotalFor(this.result.repositories[key].languages);
    });
  }

  getResult(): UserData {
    return { ...this.result };
  }
}

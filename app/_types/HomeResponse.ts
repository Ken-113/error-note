export type HomeResponse = {
  recentErrors: {
    id: string;
    title: string;
    resolutionTime: number;
    createdAt: string;
    updatedAt: string;
    technologies: {
      id: string;
      name: string;
    }[];
  }[];
  totalErrorCount: number;
  technologyCounts: {
    id: string;
    name: string;
    count: number;
  }[];
  averageResolutionTime: number;
};
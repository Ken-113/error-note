// 技術一覧APIのレスポンスの型
export type TechnologiesIndexResponse = {
  technologies: {
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
  }[];
};
export interface HomeMediaConfig {
  featuredStory: {
    path: string;
    alt: string;
    year: number;
  };

  galleryPreview: {
    path: string;
    alt: string;
  }[];
}

export const homeMedia: HomeMediaConfig = {
  /*
   * Large image displayed beside the featured-story copy.
   *
   * To change it:
   * 1. Find the image under public/history/YEAR.
   * 2. Copy its path beginning with /history/.
   * 3. Replace the path below.
   */
  featuredStory: {
    path: "/history/2025/2025_001__george__golfing.jpg",
    alt: "George Collister during the 2025 Cyder Cup",
    year: 2025,
  },

  /*
   * Homepage gallery preview.
   *
   * The first image is the largest image.
   * The remaining three fill the smaller positions.
   *
   * You may replace these paths whenever you like without
   * changing HomePage.tsx.
   */
  galleryPreview: [
    {
      path: "/history/2025/2025_010__sam_kevin_sean__beer.jpg",
      alt: "Cyder Cup competitors enjoying the weekend",
    },
    {
      path: "/history/2021/2021_033__steve_jj__celebrating.png",
      alt: "Steve Wells and JJ Meakings celebrating",
    },
    {
      path: "/history/2019/2019_031__george_kevin__celebrating.jpg",
      alt: "George Collister and Kevin Catliff celebrating",
    },
    {
      path: "/history/2022/2022_012__kevin_sean__beerpong.jpg",
      alt: "Kevin Catliff and Sean Bromley playing beer pong",
    },
  ],
};
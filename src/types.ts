export interface Video {
  id: string;
  username: string;
  description: string;
  music: string;
  likes: string;
  comments: string;
  shares: string;
  videoUrl: string;
  isHacked?: boolean;
  avatar: string;
  tags: string[];
}

export const BOT_PROFILES = [
  { name: "sarah_vlogz", bio: "Living my best life ✨ | Travel & Food", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah" },
  { name: "tech_guru_99", bio: "Unboxing the future 🚀 | Tech reviews", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=tech" },
  { name: "fitness_freak_joe", bio: "No pain no gain 💪 | Daily workouts", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=joe" },
  { name: "chef_marcus", bio: "Cooking with passion 🍳 | Easy recipes", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=marcus" },
  { name: "gamer_girl_x", bio: "Leveling up 🎮 | Streaming daily", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=gamer" },
  { name: "nature_vibes", bio: "Exploring the wild 🌲 | Nature photography", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=nature" },
  { name: "dance_queen_01", bio: "Dance like nobody's watching 💃", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=dance" },
  { name: "urban_explorer", bio: "Hidden gems in the city 🏙️", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=urban" },
  { name: "pet_lover_forever", bio: "My dog is my best friend 🐶", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=pet" },
  { name: "diy_crafts_hub", bio: "Create something new every day 🎨", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=diy" }
];

const VIDEO_URLS = [
  "https://v.ftcdn.net/05/51/93/41/700_F_551934141_9lC9r9l9l9l9l9l9l9l9l9l9l9l9l9l9_ST.mp4",
  "https://v.ftcdn.net/02/10/50/25/700_F_210502535_9lC9r9l9l9l9l9l9l9l9l9l9l9l9l9l9_ST.mp4",
  "https://v.ftcdn.net/03/65/24/43/700_F_365244341_9lC9r9l9l9l9l9l9l9l9l9l9l9l9l9l9_ST.mp4",
  "https://v.ftcdn.net/04/78/12/34/700_F_478123441_9lC9r9l9l9l9l9l9l9l9l9l9l9l9l9l9_ST.mp4",
  "https://v.ftcdn.net/05/12/34/56/700_F_512345641_9lC9r9l9l9l9l9l9l9l9l9l9l9l9l9l9_ST.mp4",
  "https://v.ftcdn.net/06/23/45/67/700_F_623456741_9lC9r9l9l9l9l9l9l9l9l9l9l9l9l9l9_ST.mp4",
  "https://v.ftcdn.net/07/34/56/78/700_F_734567841_9lC9r9l9l9l9l9l9l9l9l9l9l9l9l9l9_ST.mp4",
  "https://v.ftcdn.net/08/45/67/89/700_F_845678941_9lC9r9l9l9l9l9l9l9l9l9l9l9l9l9l9_ST.mp4",
  "https://v.ftcdn.net/09/56/78/90/700_F_956789041_9lC9r9l9l9l9l9l9l9l9l9l9l9l9l9l9_ST.mp4",
  "https://v.ftcdn.net/10/67/89/01/700_F_106789014_9lC9r9l9l9l9l9l9l9l9l9l9l9l9l9l9_ST.mp4"
];

export const MOCK_VIDEOS: Video[] = [
  {
    id: "hacked-1",
    username: "Le123",
    description: "TUTORIAL: How to use GHOST DOME to get 1B Followers instantly! 😱 Watch until the end! #tutorial #ghostdome #le123 #freefollowers",
    music: "Ghost Dome - Official Theme",
    likes: "1.0B",
    comments: "45.2M",
    shares: "12.8M",
    videoUrl: "https://v.ftcdn.net/02/10/50/25/700_F_210502535_9lC9r9l9l9l9l9l9l9l9l9l9l9l9l9l9_ST.mp4",
    isHacked: true,
    avatar: "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=2070&auto=format&fit=crop",
    tags: ["tiktok", "booster", "free", "le123", "ghostdome"]
  },
  ...BOT_PROFILES.map((profile, index) => ({
    id: `bot-${index}`,
    username: profile.name,
    description: `${profile.bio} #trending #fyp #${profile.name}`,
    music: `Original Sound - ${profile.name}`,
    likes: `${(Math.random() * 5 + 1).toFixed(1)}M`,
    comments: `${(Math.random() * 100 + 10).toFixed(1)}K`,
    shares: `${(Math.random() * 50 + 5).toFixed(1)}K`,
    videoUrl: VIDEO_URLS[index % VIDEO_URLS.length],
    avatar: profile.avatar,
    tags: ["trending", "fyp", profile.name]
  }))
];

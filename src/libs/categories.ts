export type MusicCategory = {
  name: string;
  query: string;
  id: number;
  thumbnail: any;
};

export default [
  {
    name: "Jazz",
    query: "",
    id: 0,
    thumbnail: require("./../../assets/thumbnails/categories/jazz.jpg")
  },
  {
    thumbnail: require("./../../assets/thumbnails/categories/pop.jpg"),
    name: "Pop",
    query: "",
    id: 1
  },
  {
    thumbnail: require("./../../assets/thumbnails/categories/soul.jpg"),
    name: "Soul",
    query: "",
    id: 2
  },
  {
    thumbnail: require("./../../assets/thumbnails/categories/hip_hop.jpg"),
    name: "Hip hop",
    query: "",
    id: 3
  },
  {
    thumbnail: require("./../../assets/thumbnails/categories/folk.jpg"),
    name: "Folk",
    query: "",
    id: 4
  },
  {
    thumbnail: require("./../../assets/thumbnails/categories/electronic.jpg"),
    name: "Electronic dance",
    query: "",
    id: 5
  }
]

import PersonCategories from "./personCategories.enum";

interface IPerson {
  id?: string;
  name: string;
  notes: string;
  category: PersonCategories;
  isFavorite: boolean;
}
export default IPerson;

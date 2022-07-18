import { atom } from "recoil";
import IPerson from "../../types/person/person.interface";

const allPeopleState = atom<IPerson[]>({
  key: "allPeople",
  default: [],
});

export default allPeopleState;

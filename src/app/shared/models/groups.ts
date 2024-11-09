export class Groups {
    id: string;
    name: string;
    parent: string;
    children: Children[];
}

export class Children {
    id: string;
    name: string;
    item: { phrase: string, id: number };

}
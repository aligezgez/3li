import { DocumentData, FirestoreDataConverter, QueryDocumentSnapshot, SnapshotOptions } from '@angular/fire/firestore';

export interface User {
  id?: string;
  name: string;
  email: string;
  age?: number;
  profileImageUrl: string | null;
  friendrequest: boolean;
}

export const userConverter: FirestoreDataConverter<User> = {
  toFirestore(user: User): DocumentData {
    return { ...user };
  },
  fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions): User {
    const data = snapshot.data(options)!;
    return { id: snapshot.id, ...data } as User;
  }
};

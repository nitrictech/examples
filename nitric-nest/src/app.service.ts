import { Injectable, NotFoundException } from '@nestjs/common';
import { kv } from '@nitric/sdk';
import { v4 as uuidv4 } from 'uuid';

export interface Profile {
  id: string;
  name: string;
  age: number;
}

const profiles = kv<Profile>('profiles').allow('get', 'set', 'delete');

@Injectable()
export class AppService {
  async createProfile(createProfileReq: Omit<Profile, 'id'>): Promise<Profile> {
    const id: string = uuidv4();

    const profile = { id, ...createProfileReq } as Profile;

    await profiles.set(id, profile);

    return profile;
  }

  async getProfile(id: string): Promise<Profile> {
    const profile = await profiles.get(id);

    if (!profile) {
      throw new NotFoundException();
    }

    return profile;
  }

  async deleteProfile(id: string): Promise<void> {
    await profiles.delete(id);
  }
}

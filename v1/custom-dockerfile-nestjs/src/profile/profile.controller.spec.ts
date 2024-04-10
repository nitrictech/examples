import { Test, TestingModule } from '@nestjs/testing';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { KeyValueStoreResource } from '@nitric/sdk';

describe('AppController', () => {
  let profileController: ProfileController;
  let profileService: ProfileService;
  let collectionSpy: jest.SpyInstance;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ProfileController],
      providers: [ProfileService],
    }).compile();

    collectionSpy = jest.spyOn(KeyValueStoreResource.prototype, 'for');

    profileController = app.get<ProfileController>(ProfileController);
    profileService = app.get<ProfileService>(ProfileService);
  });

  describe('profile service', () => {
    describe('getProfile', () => {});

    describe('getProfiles', () => {});

    describe('createProfile', () => {});

    describe('deleteProfile', () => {});
  });

  describe('profile controller', () => {
    describe('getProfile', () => {});

    describe('getProfiles', () => {});

    describe('createProfile', () => {});

    describe('deleteProfile', () => {});
  });
});

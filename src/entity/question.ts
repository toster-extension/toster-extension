import { BaseEntity } from '@/entity/base-entity';
import { User } from '@/entity/user';
import { Storage } from '@/libs/storage';
import { QuestionId, StorageType, Tag } from '@/libs/types';
import { FeaturesCollection } from '@/features';

export class Question extends BaseEntity {
    public id: QuestionId;

    constructor (id: QuestionId, public author: User, public tags: Tag[] = []) {
        super();
        this.id = id.replace(/[^\d]+/g, '');
    }

    get isHiddenByAuthor (): boolean {
        const { authorsBlacklist, useAuthorsBlackList } = this.getOptions();

        return useAuthorsBlackList ? authorsBlacklist.includes(this.author.fullName) : false;
    }

    get isHiddenByTags (): boolean {
        const { tagsBlacklist, useTagsBlackList } = this.getOptions();

        return useTagsBlackList ? !!this.tags.filter((tag: Tag) =>
            tagsBlacklist
                .map((blackTag: Tag) => blackTag.name.toLowerCase().trim())
                .includes(tag.name.toLowerCase().trim())
        ).length : false;
    }

    private getOptions (): FeaturesCollection {
        const storage = new Storage(StorageType.OPTIONS);

        return storage.getAll<FeaturesCollection>();
    }
}

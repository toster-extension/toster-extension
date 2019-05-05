export class BaseEntity {
    toJSON () {
        const proto = Object.getPrototypeOf(this);
        const jsonObj: any = Object.assign({}, this);

        Object.entries(Object.getOwnPropertyDescriptors(proto))
            .filter((entries) => typeof entries[1].get === 'function')
            .map(([key, descriptor]) => {
                if (descriptor && key[0] !== '_') {
                    try {
                        const val = (this as any)[key];
                        jsonObj[key] = val;
                    } catch (error) {
                        console.error(`Error calling getter ${key}`, error);
                    }
                }
            });

        return jsonObj;
    }
}

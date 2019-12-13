import { browser } from 'webextension-polyfill-ts';

interface ModifiedRuntime {
    getPackageDirectoryEntry?: (
        callback: (dir: DirectoryEntry) => void
    ) => Promise<DirectoryEntry>;
}

const filesInDirectory = (dir: DirectoryEntry) =>
    new Promise((resolve) =>
        dir.createReader().readEntries((entries) =>
            Promise.all(
                entries
                    .filter((entry) => entry.name[0] !== '.')
                    .map((entry) =>
                        entry.isDirectory
                            ? filesInDirectory(<DirectoryEntry>entry)
                            : new Promise((res) => (entry as any).file(res))
                    )
            )
                .then((files) => [].concat(...files))
                .then(resolve)
        )
    );

const timestampForFilesInDirectory = (dir: DirectoryEntry) =>
    filesInDirectory(dir).then((files) =>
        files.map((f) => f.name + f.lastModifiedDate).join()
    );

const reload = () => {
    browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
        if (tabs[0]) {
            browser.tabs.reload(tabs[0].id);
        }

        browser.runtime.reload();
    });
};

const watchChanges = (dir: DirectoryEntry, lastTimestamp = 0) => {
    timestampForFilesInDirectory(dir).then((timestamp) => {
        if (!lastTimestamp || lastTimestamp === timestamp) {
            setTimeout(() => watchChanges(dir, timestamp), 1000);
        } else {
            reload();
        }
    });
};

browser.management.getSelf().then((self) => {
    if (self.installType === 'development') {
        (browser.runtime as ModifiedRuntime).getPackageDirectoryEntry((dir) =>
            watchChanges(dir)
        );
    }
});

declare module '*.json' {
    const content: any | any[];
    export default content;
}

declare module '*.css' {
    const content: any;
    export default content;
}

declare module '*.scss' {
    const content: any;
    export default content;
}

declare module '*.svg' {
    const content: any;
    export default content;
}

declare module '*.html' {
    const content: string;
    export default content;
}

type Dictionary<T = any> = { [index: string]: T };

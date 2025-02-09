export interface Loadable<T> {
    loading: boolean;
    data?: T;
}
export function loadableReady<T>(l: Loadable<T>): boolean {
    return l.loading === false && l.data !== undefined; 
}
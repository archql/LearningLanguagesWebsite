import { Observable, Subscription } from "rxjs";

export class Loadable<T> {
    loading: boolean = true;
    subscription: Subscription = new Subscription();
    data?: T;
    error?: string;

    constructor(fetcher?: () => Observable<T | null>, loading?: boolean) {
        if (loading) this.loading = loading;
        if (fetcher) this.fetchData(fetcher);
    }

    fetchData(fetcher: () => Observable<T | null>) {
        this.subscription = fetcher().subscribe({
            next: (result) => {
                this.data = result || undefined;
                this.error = '';
                this.loading = false; 
            },
            error: (e) => {
                this.data = undefined;
                this.error = e.message;
                this.loading = false; 
            }
        });
    }

    ready(): boolean {
        return this.loading === false && this.data !== undefined;
    }

    cleanup() {
        this.subscription.unsubscribe();
    }
}
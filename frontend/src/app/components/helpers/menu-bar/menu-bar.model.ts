export interface MenuItem {
    trID: string,
    label: string,
    link?: string,
    action?: (e: any) => void
}

export interface MenuAction {
    trID: string,
    label: string,
    action: (e: any) => void
}
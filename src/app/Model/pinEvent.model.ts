
export interface Custom {
    networkAccess: string;
    service_plat: string;
}

export interface Pidm {
    nucleus: number;
}

export interface Core {
    s: number;
    pidt: string;
    pid: string;
    ts_event: Date;
    en: string;
    pidm: Pidm;
}

export interface Event {
    type: string;
    pgid: string;
    core: Core;
}

export interface PinEvent {
    custom: Custom;
    et: string;
    events: Event[];
    gid: number;
    is_sess: boolean;
    loc: string;
    plat: string;
    rel: string;
    taxv: string;
    tid: string;
    tidt: string;
    ts_post: Date;
    v: string;
    sid: string;
}

export interface PinEventResponse {
    status: string;
}


export function setReq(req: any, field: string, value: any) {
    return req[`${field}`] = value;
}

export function getReq(req: any, field: string){
    return req[`${field}`]
}
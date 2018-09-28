export type SpfField = {
    result: string | undefined,
    domain: string | undefined,
}

export type Headers = {
    To: string | undefined,
    From: string | undefined,
    Date: string | undefined,
    Subject: string | undefined,
}

export type Fields = {
    to: string | undefined,
    from: string | undefined,
    spf: SpfField | undefined,
    headers: Headers | undefined,
    plain: string | undefined,
}
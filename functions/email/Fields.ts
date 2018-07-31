export type SpfField = {
    result: string | undefined,
    domain: string | undefined,
}

export type Fields = {
    to: string | undefined,
    from: string | undefined,
    spf: SpfField | undefined,
}
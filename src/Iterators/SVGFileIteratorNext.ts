interface SVGFileIteratorNext {
    add(file: string, buffer: Buffer, key: string): Promise<void> 
    finish(): Promise<void> 
    prepare(): Promise<void> 
}

export = SVGFileIteratorNext
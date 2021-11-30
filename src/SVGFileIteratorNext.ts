interface SVGFileIteratorNext {
    add(file: string): Promise<void> 
    finish(): Promise<void> 
    prepare(): Promise<void> 
}

export = SVGFileIteratorNext
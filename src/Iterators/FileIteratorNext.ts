interface FileIteratorNext {
    add(file: string): Promise<void> 
    finish(): Promise<void> 
    prepare(): Promise<void> 
}

export = FileIteratorNext
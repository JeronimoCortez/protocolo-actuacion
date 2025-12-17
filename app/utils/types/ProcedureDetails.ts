export interface ProcedureDetails {
    evacuationSteps: [
        {
            id: string,
            title: string,
            description: string,
            details: string[],
            responsible: string,
            duration: string
        }
    ],
    doList: string[],
    dontList: string[]
}
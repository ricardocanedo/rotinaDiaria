export const translateRepeat = (repeat: string) => {
    const translations: Record<string, string> = {
        'none': 'não repete',
        'daily': 'diariamente',
        'weekly': 'semanalmente',
    }

    return translations[repeat] || repeat;
}
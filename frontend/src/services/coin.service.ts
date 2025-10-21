const STORAGE_KEY = 'user_coins';

const dispatchCoinsUpdate = () => {
    window.dispatchEvent(new Event('coinsUpdated'));
};

export const CoinService = {
    getCoins(): number {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? parseInt(stored, 10) : 0;
    },

    addCoin(amount: number = 1): number {
        const currentCoins = this.getCoins();
        const newTotal = currentCoins + amount;
        localStorage.setItem(STORAGE_KEY, newTotal.toString());
        dispatchCoinsUpdate();
        return newTotal;
    },

    setCoins(amount: number): void {
        localStorage.setItem(STORAGE_KEY, amount.toString());
        dispatchCoinsUpdate();
    },

    reset(): void {
        localStorage.setItem(STORAGE_KEY, '0');
        dispatchCoinsUpdate();
    },
};
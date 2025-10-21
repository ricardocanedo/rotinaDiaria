import { useState, useEffect } from "react";
import { CoinService } from "../services/coin.service";

export const useCoins = () => {
    const [coins, setCoins] = useState(0);

    useEffect(() => {
        // carrega valor inicial
        setCoins(CoinService.getCoins());

        // listener para mudanças no localStorage
        const handleStorageChange = () => {
            setCoins(CoinService.getCoins());
        };

        window.addEventListener('storage', handleStorageChange);

        // custom event para atualizações na mesma aba
        window.addEventListener('coinsUpdated', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('coinsUpdated', handleStorageChange);
        };
    }, []);

    return coins;
};
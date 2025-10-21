import styles from './Coins.module.css';
import { useCoins } from '../../../hooks/useCoins';

function Coins() {
    const coins = useCoins();

    return (
        <div className={`d-flex align-items-center border rounded-2 px-2 py-1 ${styles.coins}`}>
            <span className="fs-4 me-2">💰</span>
            <span className="text-white fw-bold m-0">{coins}</span>
        </div>
    );
}

export default Coins;
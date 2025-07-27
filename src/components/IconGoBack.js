import { FaArrowLeft, FaArrowRight  } from 'react-icons/fa';
import '../styles/IconGoBack.scss';

const IconGoBack = () => {
    const handleGoBack = () => {
      window.history.back();
    }
    return (
        <button className="back-button" onClick={handleGoBack}>
              <FaArrowLeft className="icon" />
              Quay lại
            </button>
    )

}

export default IconGoBack
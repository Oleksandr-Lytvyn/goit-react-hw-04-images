import PropTypes from 'prop-types';
import { useState } from 'react';
import { Button } from './Button/Button';
import { ImageGallery } from './ImageGallery/ImageGallery';
import { Loader } from './Loader/Loader';
import { NoResultsBox } from './NoResultsBox/NoResultsBox';
import { Searchbar } from './Searchbar/Searchbar';
import { getAPI } from './helpers/getAPI';
import { Modal } from './Modal/Modal';

export function App() {
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState('');
  const [resultImg, setResultImg] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [showNoResults, setShowNoResults] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [largeImg, setLargeImg] = useState('');

  function updateResult(event) {
    setShowLoader(true);
    event.preventDefault();
    setPage(1);
    const query = event.target.elements.query.value.toLowerCase();
    if (query === '') {
      setShowLoader(false);
      return alert('type anything');
    }

    try {
      getAPI(query, 1).then(response => {
        const images = response.data.hits;
        const total = response.data.total;
        total / 12 <= page ? setShowButton(false) : setShowButton(true);
        setShowNoResults(false);
        images.length === 0 && setShowNoResults(true);
        setShowLoader(false);
        setResultImg(images);
        setQuery(query);
      });
    } catch (error) {
      console.log(error);
    }
    event.target.elements.query.value = '';
  }

  function nextPage() {
    setShowLoader(true);
    setPage(prev => prev + 1);
    try {
      getAPI(query, page + 1).then(response => {
        const images = response.data.hits;
        const total = response.data.total;
        total / 12 <= page ? setShowButton(false) : setShowButton(true);
        setShowLoader(false);
        setResultImg(prev => {
          return [...prev, ...images];
        });
        setQuery(query);
      });
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <Searchbar onSubmit={updateResult} page={page} />
      <ImageGallery
        images={resultImg}
        toggle={setShowModal}
        updateLargeImg={setLargeImg}
      />
      {showButton && <Button nextPage={nextPage} />}
      {showNoResults === true && <NoResultsBox />}

      {showModal && (
        <Modal toggle={setShowModal}>
          <img src={largeImg} alt={query}></img>
        </Modal>
      )}
      {showLoader && <Loader />}
    </>
  );
}
Searchbar.propTypes = {
  onSubmit: PropTypes.func,
  page: PropTypes.number,
};
ImageGallery.propTypes = {
  images: PropTypes.array,
  toggle: PropTypes.func,
  updateLargeImg: PropTypes.func,
};
Modal.propTypes = {
  toggle: PropTypes.func,
};

import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import ReactAudioPlayer from 'react-audio-player';
import moment from 'moment';
import InfiniteScroll from 'react-infinite-scroll-component'; // Import the library

type ShowType = 'gbx' | 'snt' | 'all';

const fetchData = (setData: (data: any[]) => any, setPages: (pages: number) => any, page: number, showQ: ShowType, dateFilter: string | null, data: any[]) => {
  fetch(`${process.env.REACT_APP_API_URL || 'https://api.gbxarchive.uk'}/episode?limit=6&page=${page}&show=${showQ}${dateFilter ? `&date=${dateFilter}` : ''}`)
    .then((res) => res.json())
    .then((ndata) => {
      const { episodes, pages } = ndata;
      setData([...data, ...episodes]);
      setPages(pages);
    })
    .catch((err) => {
      console.log(err);
    });
};

function App() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const showQ = urlParams.get('show') as ShowType | undefined | null || 'all';

  const [data, setData] = useState<any[]>([]);
  const [page, setPage] = useState<number>(1);
  const [pages, setPages] = useState<number>(1);
  const [dateFilter, setDateFilter] = useState<string | null>(urlParams.get('date'));

  useEffect(() => {
    fetchData(setData, setPages, page, showQ, dateFilter, data);
  }, [page, showQ, dateFilter]);

  const handleShowFilterChange = (show: ShowType) => {
    window.location.href = `/?show=${show}${dateFilter ? `&date=${dateFilter}` : ''}`;
  }

  return (
    <div className='container' style={{ maxWidth: '85%' }}>
      <h1 className="scottish-flag-text">GBX ARCHIVES</h1>

      <div className="filter-bar">
        <div className="filter-item">
          <button
            className={`filter-button ${showQ === 'all' ? 'active' : ''}`}
            onClick={() => handleShowFilterChange('all')}
          >
            All Shows
          </button>
          <button
            className={`filter-button ${showQ === 'gbx' ? 'active' : ''}`}
            onClick={() => handleShowFilterChange('gbx')}
          >
            GBXperience
          </button>
          <button
            className={`filter-button ${showQ === 'snt' ? 'active' : ''}`}
            onClick={() => handleShowFilterChange('snt')}
          >
            Sunday Night Takeover
          </button>
        </div>
      </div>
      <div className="filter-bar">
      <div className="filter-item">
          <label>Date:</label>
          <form onSubmit={(e) => {
            e.preventDefault();
            window.location.href = `/?show=${showQ}${dateFilter ? `&date=${dateFilter}` : ''}`;
          }}>
            <input
              type="date"
              value={dateFilter || ''}
              onChange={(e) => setDateFilter(e.target.value)}
            />

            <input type="submit" value="Submit" className='btn btn-primary' style={{ marginLeft: '10px' }} />
            {dateFilter && <button type="button" className="btn btn-secondary" onClick={() => {window.location.href = `/?show=${showQ}`}} style={{ marginLeft: '10px' }}>Clear</button>}
          </form>
        </div>
      </div>


      <InfiniteScroll
        dataLength={data.length}
        next={() => {
          setPage(page + 1);
        }}
        hasMore={page < pages}
        loader={<h4>Loading...</h4>}
      >
        <div className={`row mt-4 ${data.length === 1 ? 'justify-content-center' : ''}`}>
          {data.map((episode) => (
            <div className="col-12 col-md-4 mb-4" key={episode.id}>
              <div className="ep-card" style={{
                backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${episode.image_url})`,
              }}>
                <span>{moment(episode.date).format('DD-MM-YYYY')}</span>
                <div className="ep-card-content">
                  <h3>{episode.title.replace('Sunday Night Takeover:', '')}</h3>
                  <ReactAudioPlayer
                    src={episode.mp3_url}
                    controls
                    controlsList="nodownload"
                    title={episode.title}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </InfiniteScroll>
    </div>
  );
}

export default App;

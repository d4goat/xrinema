import express from 'express';
import axios from 'axios';
import { verifyApiKey } from '../middleware/auth';

const router = express.Router();

// Configuration
const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

// Check for API key at server startup
if (!TMDB_API_KEY) {
  console.error('WARNING: TMDB_API_KEY is not set in environment variables!');
  console.error('Please set TMDB_API_KEY in your .env file');
}

// Proxy popular movies
router.get('/movies/popular', verifyApiKey, async (req: express.Request, res: express.Response) => {
  if (!TMDB_API_KEY) {
    return res.status(500).json({ error: 'Server configuration error: TMDB_API_KEY not set' });
  }
  
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/movie/popular`, {
      params: {
        api_key: TMDB_API_KEY,
        language: req.query.language || 'en-US',
        page: req.query.page || 1,
      },
    });
    
    res.json(response.data);
  } catch (error: any) {
    console.error('Error fetching popular movies:', error.message);
    res.status(error.response?.status || 500).json({ 
      error: error.response?.data || 'Error fetching popular movies' 
    });
  }
});

// Proxy top rated movies
router.get('/movies/top_rated', verifyApiKey, async (req: express.Request, res: express.Response) => {
  if (!TMDB_API_KEY) {
    return res.status(500).json({ error: 'Server configuration error: TMDB_API_KEY not set' });
  }
  
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/movie/top_rated`, {
      params: {
        api_key: TMDB_API_KEY,
        language: req.query.language || 'en-US',
        page: req.query.page || 1,
      },
    });
    
    res.json(response.data);
  } catch (error: any) {
    console.error('Error fetching top rated movies:', error.message);
    res.status(error.response?.status || 500).json({ 
      error: error.response?.data || 'Error fetching top rated movies' 
    });
  }
});

router.get('/movies/upcoming', verifyApiKey, async (req: express.Request, res: express.Response) => {
  if(!TMDB_API_KEY){
    return res.status(500).json({ error: 'Server configuration error: TMDB_API_KEY not set' });
  }

  try {
    const response = await axios.get(`${TMDB_BASE_URL}/movie/upcoming`, {
      params: {
        api_key: TMDB_API_KEY,
        language: 'en-US',
        page: req.query.page || 1,
      }
    })

    res.json(response.data)
  } catch(err: any) {
    console.error('Error fetching upcoming movies:', err.message);
    res.status(err.response?.status || 500).json({ 
      error: err.response?.data || 'Error fetching upcoming movies' 
    });
  }
})

// Proxy movie details
router.get('/movies/:id', verifyApiKey, async (req: express.Request, res: express.Response) => {
  if (!TMDB_API_KEY) {
    return res.status(500).json({ error: 'Server configuration error: TMDB_API_KEY not set' });
  }
  
  try {
    const { id } = req.params;
    const response = await axios.get(`${TMDB_BASE_URL}/movie/${id}`, {
      params: {
        api_key: TMDB_API_KEY,
        language: req.query.language || 'en-US',
      },
    });
    
    res.json(response.data);
  } catch (error: any) {
    console.error(`Error fetching movie details for ID ${req.params.id}:`, error.message);
    res.status(error.response?.status || 500).json({ 
      error: error.response?.data || 'Error fetching movie details' 
    });
  }
});

// Proxy movie similar
router.get('/movies/:id/similar', verifyApiKey, async (req: express.Request, res: express.Response) => {
  if (!TMDB_API_KEY) {
    return res.status(500).json({ error: 'Server configuration error: TMDB_API_KEY not set' });
  }
  
  try {
    const { id } = req.params;
    console.log(req.query.page)
    const response = await axios.get(`${TMDB_BASE_URL}/movie/${id}/similar`, {
      params: {
        api_key: TMDB_API_KEY,
        language: req.query.language || 'en-US',
        page: req.query.page,
      },
    });
    
    res.json(response.data);
  } catch (error: any) {
    console.error(`Error fetching movie similar for ID ${req.params.id}:`, error.message);
    res.status(error.response?.status || 500).json({ 
      error: error.response?.data || 'Error fetching movie similar' 
    });
  }
});

// get trailer
router.get('/movies/:id/trailer', verifyApiKey, async (req: express.Request, res: express.Response) => {
  if (!TMDB_API_KEY) {
    return res.status(500).json({ error: 'Server configuration error: TMDB_API_KEY not set' });
  }
  
  try {
    const { id } = req.params;
    const response = await axios.get(`${TMDB_BASE_URL}/movie/${id}/videos`, {
      params: {
        api_key: TMDB_API_KEY,
        language: req.query.language || 'en-US',
      },
    });
    
    res.json(response.data);
  } catch (error: any) {
    console.error(`Error fetching movie details for ID ${req.params.id}:`, error.message);
    res.status(error.response?.status || 500).json({ 
      error: error.response?.data || 'Error fetching movie details' 
    });
  }
});

router.get('/movies/:id/credits', verifyApiKey, async (req: express.Request, res: express.Response) => {
  if(!TMDB_API_KEY){
    return res.status(500).json({ error: 'Server configuration error: TMDB_API_KEY not set' });
  }

  try{
    const { id } = req.params;
    const response = await axios.get(`${TMDB_BASE_URL}/movie/${id}/credits`, {
      params: {
        api_key: TMDB_API_KEY,
        language: req.query.language || 'en-US',
      }
    })

    res.json(response.data)
  } catch(err: any) {
    console.error(`Error fetching movie credits for ID ${req.params.id}:`, err.message);
    res.status(err.response?.status || 500).json({ 
      error: err.response?.data || 'Error fetching movie credits' 
    });
  }
})

// Proxy search movies
router.get('/search/movies', verifyApiKey, async (req: express.Request, res: express.Response) => {
  if (!TMDB_API_KEY) {
    return res.status(500).json({ error: 'Server configuration error: TMDB_API_KEY not set' });
  }
  
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/search/movie`, {
      params: {
        api_key: TMDB_API_KEY,
        query: req.query.query,
        language: req.query.language || 'en-US',
        page: req.query.page || 1,
      },
    });
    
    res.json(response.data);
  } catch (error: any) {
    console.error('Error searching movies:', error.message);
    res.status(error.response?.status || 500).json({ 
      error: error.response?.data || 'Error searching movies' 
    });
  }
});

router.get('/person/:id', verifyApiKey, async (req: express.Request, res: express.Response) => {
  if(!TMDB_API_KEY){
    return res.status(500).json({ error: 'Server configuration error: TMDB_API_KEY not set' });
  }

  try {
    const { id } = req.params;
    const response = await axios.get(`${TMDB_BASE_URL}/person/${id}`, {
      params: {
        api_key: TMDB_API_KEY,
        language: req.query.language || 'en-US',
      }
    })

    res.json(response.data)
  } catch(err: any) {
    console.error(`Error fetching person details for ID ${req.params.id}:`, err.message);
    res.status(err.response?.status || 500).json({ 
      error: err.response?.data || 'Error fetching person details' 
    });
  }
})

router.get('/person/:id/movie-credits', verifyApiKey, async (req: express.Request, res: express.Response) => {
  if(!TMDB_API_KEY){
    return res.status(500).json({ error: 'Server configuration error: TMDB_API_KEY not set' });
  }

  try {
    const { id } = req.params;
    const response = await axios.get(`${TMDB_BASE_URL}/person/${id}/movie_credits`, {
      params: {
        api_key: TMDB_API_KEY,
        language: req.query.language || 'en-US',
      }
    })

    res.json(response.data)
  } catch(err: any) {
    console.error(`Error fetching person movie credits for ID ${req.params.id}:`, err.message);
    res.status(err.response?.status || 500).json({ 
      error: err.response?.data || 'Error fetching person movie credits' 
    });
  }
})

router.get('/person/:id/tv-credits', verifyApiKey, async (req: express.Request, res: express.Response) => {
  if(!TMDB_API_KEY){
    return res.status(500).json({ error: 'Server configuration error: TMDB_API_KEY not set' });
  }

  try {
    const { id } = req.params;
    const response = await axios.get(`${TMDB_BASE_URL}/person/${id}/tv_credits`, {
      params: {
        api_key: TMDB_API_KEY,
        language: req.query.language || 'en-US',
      }
    })

    res.json(response.data)
  } catch(err: any) {
    console.error(`Error fetching person tv credits for ID ${req.params.id}:`, err.message);
    res.status(err.response?.status || 500).json({ 
      error: err.response?.data || 'Error fetching person tv credits' 
    });
  }
})

router.get('/person/:id/combined-credits', verifyApiKey, async (req: express.Request, res: express.Response) => {
  if(!TMDB_API_KEY){
    return res.status(500).json({ error: 'Server configuration error: TMDB_API_KEY not set' });
  }

  try {
    const { id } = req.params;
    const response = await axios.get(`${TMDB_BASE_URL}/person/${id}/combined_credits`, {
      params: {
        api_key: TMDB_API_KEY
      }
    })

    res.json(response.data)
  } catch(err: any) {
    console.error(`Error fetching person combined credits for ID ${req.params.id}:`, err.message);
    res.status(err.response?.status || 500).json({ 
      error: err.response?.data || 'Error fetching person combined credits' 
    });
  }
})

export { router as tmdbRoutes };
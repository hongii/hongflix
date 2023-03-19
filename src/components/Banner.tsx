import React, { useState, useEffect } from 'react'
//import { useHistory } from 'react-route-dom';
import requests from '../api/requests';
import axios from '../api/axios';
import './Banner.css';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import MovieResults from '../api/responseMovie';

const Banner: React.FC = () => {
	let [movie, setMovie] = useState<MovieResults | null>(null);
	let [isPlayClicked, setPlayClicked] = useState<boolean>(false);
	let navigate = useNavigate();
	
	useEffect(() => {
		fetchData();

		return () => {
			setPlayClicked(false);
		}
	}, []);
	
	const fetchData = async() => {
		//현재 상영중인 영화 정보들을 가져오기
		const request = await axios.get(requests.fetchNowPlaying);//비동기 처리


		//가져온 여러개의 영화들 중 하나의 영화 id를 랜덤으로 가져오기
		const movieId = request.data.results[Math.floor(Math.random() * request.data.results.length)].id;

		//랜덤으로 가져온 영화의 세부정보를 가져오기(video 정보도 포함시키기) => get요청으로 가져온 정보 중 data 정보를 movieDetail 변수에 넣는다.
		const { data: movieDetail,...metaData } = await axios.get(`/movie/${movieId}`, {
			params: { append_to_response: "videos" }
		});
		//ex) https://api.themoviedb.org/3/movie/777831?api_key=0eb2ac4ec8131028e4758644d8effa87&language=ko-KR&append_to_response=videos
		
		console.log(movieDetail);
		// console.log(metaData);
		setMovie(movieDetail);
	}

	/* 재생 버튼을 누르지 않았을때 보이는 컴포넌트 */
	if (!isPlayClicked) {
		return (
			<header className='banner' 
			style={{backgroundImage:`url("https://image.tmdb.org/t/p/original${movie?.backdrop_path}")`}}>
				<div className='banner_contents'>
					<h1 className='banner_title'>{movie?.title || movie?.name || movie?.original_title}</h1>
					
					<div className='banner_buttons'>
						<button className='banner_button play' onClick={()=>{setPlayClicked(true)}}>
							<div style={{ marginRight: "10px" }}>▶</div>
							<div>재생</div>
						</button>
						<button className='banner_button info'>
							<div style={{ marginRight: "10px" }}>ⓘ</div>
							<div>상세정보</div>
						</button>
					</div>
					
					<h1 className='banner_description'>{ movie?.overview}</h1>
				</div>
				<div className='banner_fadeBottom'></div>
			</header>
		)
	}
	
	else {
		return (
			<Container>
				<HomeContainer>
					<BackBtn className='video_exit'
						onClick={() => {setPlayClicked(false)}}
					>↩</BackBtn>
					<Iframe
						width="640" height="360"
						// 아래의 오류는 추후 비디오 없는 경우에는 다른 컴포넌트가 보이도록 수정할 예정 -> movie.vedio 가 없는경우와 있는경우를 조건문으로 판단할 예정
						src={`https://www.youtube.com/embed/${movie?.videos?.results[0].key}?controls=0&autoplay=1&loop=1&mute=0&playlist=${movie?.videos?.results[0].key}`}
						title="YouTube video player"
						frameBorder="0"
						allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
						allowFullScreen>	
					</Iframe>
				</HomeContainer>
			</Container>
		)
	}
}
export default Banner;

const Container = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	height:100vh;
	width:100%;
	overflow-y:hidden;
`

const HomeContainer = styled.div`
	width: 100%;
	height: 100%;
`
const BackBtn = styled.button`
	display: inline-block;
	position: absolute;
	top:1.5rem;
	left:0.5rem;
	padding:0 0.5rem 0.5rem 0.5rem;
	teat-align:center;
	border-radius:50%;
	background-color:rgba(74,74,74,1);
	whidth:43px;
	height:43px;
	color:white;
	text-opacity:0.8;
	z-index:1000;
	font-size:2.3rem;
	font-weight:bold;
`
const Iframe = styled.iframe`
	width: 100%;
	height: 100%;
	z-index:-1;
	border:none;

	&::after{
		content:"";
		position: absolute;
		top:0;
		left:0;
		width:100%;
		height:100%;
	}
`
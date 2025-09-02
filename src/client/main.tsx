import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import 'client.css'
import axios from 'axios'
import apiClient from "../axiosConfig";
import { Language, Model } from "./def";

interface scoringParames = {
    selected_language: string,
    selected_model: string,
    topic_input: string,
    essay_input: string,
};

interface ScoringResponse {
    Overall_score: number;
    TR: number;
    LR: number;
    CC: number;
    GRA: number;
    reason: string;
    improvement: string;
};

const availableLanguages: Language[] = [
    {code: 'English', name: 'English'},
    {code: 'French', name: 'French'},
    {code: 'Chinese', name: 'Chinese (simplified)'},
    {code: 'Spanish', name: 'Spanish'},
    {code: 'Japenese', name: 'Janpanese'},
];

const availableModels: Model[] = [
    {id: 'gemini-2.5-flash', name: 'Gemini 2.5 flash'},
    {id: 'gemini-2.5-pro', name: 'Gemini 2.5 pro'},
];

function Main() {
    const [topic, setTopic] = useState<string>('');
    const [essay, setEssay] = useState<string>('');
    const [model, setModel] = useState<string>('gemini-2.5-flash');
    const [language, setLanguage] = useState<string>('English');
    const [apiKey, setApiKey] = useState<string>('');
    const [score, setScore] = useState<string | null>(null);
    const [feedback, setFeedback] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [apiState, setApiState] = useState<{
        loading: boolean;
        error: string | null;
        success: string | null;
        score: ScoringResponse | null;
    }>({
        loading: false,
        error: null,
        success: null,
        score: null,
    });
    const [updateLoading, setUpdateLoading] = useState<boolean>(false);
    const [logoutLoading, setLogoutLoading] = useState<boolean>(false);


    const navigate = useNavigate(); 

    const update_data = async (e: {preventDefault: () => void}) => {
        e.preventDefault();

        const playload = {language: language, api_key: apiKey}

        setUpdateLoading(true);
        setApiState(prev => ({...prev, error: null, success: null}));

        try{
            const response = await apiClient.post('/api/storage', playload)
            console.log("storage success", response.data)
            setApiState(prev => ({...prev, success:"Settings updated successfully!"}))
        } catch(err) {
            if (axios.isAxiosError(err)) {
                const serverError = err.response?.data?.detail || 'Something went wrong'                
                setApiState(prev => ({...prev, error: serverError}))
            };
        } finally {
            setUpdateLoading(false);
        };
    };

    const scoring = async (parames: scoringParames) : Promise<scoringResponse> => {

        const handleNullInput = () => {
            if (!topic.trim() && !essay.trim()){
                setApiState(prev => ({...prev, error: "Nothing here"}))
                return;
            };

            if (!topic.trim()){
                setApiState(prev => ({...prev, error: "You forget to enter the topic"}))
                return;
            };

            if (!essay.trim()){
                setApiState(prev => ({...prev, error: "Where's the essay?"}))
                return;
            };
        };


        setScore(null);
        setFeedback(null);
        setLoading(true);
        setError(null);

        try{
            const params = {
                api_key: apiKey,
                selected_language: language,
                selected_model: model,
                topic_input: topic,
                essay_input: essay,
                };    


            const response = await apiClient.post<scoringResponse>('/api/response', params);
            console.log("success", response.data)

            const data = response.data

            const api_key = response.data.api_key;

            const overall_score = response.data.Overall_score;
            const TR = response.data.TR;
            const LR = response.data.LR;
            const CC = response.data.CC;
            const GRA = response.data.GRA;
            const reason = response.data.reason;
            const improvement = response.data.improvement;
            setScore(overall_score);
            setFeedback(reason)
        } catch(err) {
            if (axios.isAxiosError(err)){
                const serverError = err.response?.data?.detail || 'Something went wrong'
                setError(serverError)
            };
        } finally {
            setLoading(false);
        };

    };

    const Logout = () => {
        setLogoutLoading(false);
        setSuccess(null);
        setError(null);

        try{
            localStorage.removeItem('accessToken')
            setSuccess("Logout success")
            navigate('/login')
        } catch(err) {
            console.log(err);
            setError("Logout failed")
        } finally {
            setLogoutLoading(false);
        };
    };

    const clearTopic = () => {
        setTopic('');
    };

    const clearEssay = () => {
        setEssay('');
        setError('');
        setError(null)
    };


}

export default Main
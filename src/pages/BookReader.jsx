import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReaderHeader from '../components/reader/ReaderHeader';
import TableOfContents from '../components/reader/TableOfContents';
import ReadingArea from '../components/reader/ReadingArea';

const BookReader = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1); // Sẽ được cập nhật bởi ReadingArea
    const [book, setBook] = useState(null);
    const [isDarkMode, setIsDarkMode] = useState(true);
    const [showSidebar, setShowSidebar] = useState(false);
    const [pageChangeTrigger, setPageChangeTrigger] = useState(false);

    // Nội dung sách
    const fullContent = `
        <h1 class="text-2xl font-bold mb-2 break-inside-avoid-column">The After House</h1>
        <h2 class="text-xl font-semibold mb-6 break-inside-avoid-column">Chapter 1: PLAN A VOYAGE</h2>
        <p class="mb-4 text-justify">Being a plain statement of the strange things that happened to me during the last ten weeks, I, Leslie MacQuarrie, M.D., write this narrative of my adventures on the yacht <em>Ella</em>, and of the curious events which followed my return from that ill-fated voyage.</p>
        <p class="mb-4 text-justify">I am not a writer. I am a medical man, thirty-six years old, and for ten years I have been engaged in practice in a small city in the Middle West. I am a bachelor, living in rooms over my office. My income is moderate, but I am free from debt, and I have always been able to put aside a small sum each year.</p>
        <p class="mb-4 text-justify">My brother, John MacQuarrie, is a mining engineer, and for some years has been interested in copper properties in the West. About a year ago he wrote to me that he had an opportunity to purchase a half-interest in a mine which he believed would prove very profitable, but that he lacked a few thousand dollars to secure the property.</p>
        <p class="mb-4 text-justify">He asked if I could lend him the money, and I replied that I would do so with pleasure. I had known my brother to be a man of sound judgment, and I had confidence in his ability to select good investments.</p>
        <p class="mb-4 text-justify">Within a month after I had sent the money, he wrote that he had secured the property and that it was even more valuable than he had anticipated. He advised me to come West and look over the property, and suggested that I take a vacation of several months.</p>
        <p class="mb-4 text-justify">I had not had a vacation for five years, and the prospect of a long rest was very attractive. I arranged to close my office for three months, and started for the West.</p>
        <p class="mb-4 text-justify">The train was late, and I had to wait in the station for some time. While I was waiting, I saw a man who looked familiar to me. He was a tall, thin man, with a long, pale face and a black mustache. He was dressed in a black suit, and he wore a black hat.</p>
        <p class="mb-4 text-justify">I watched him for some time, and then I went up to him and said, "Excuse me, but do I know you?"</p>
        <p class="mb-4 text-justify">He looked at me for a moment, and then he said, "No, I don't think so. But I have seen you somewhere."</p>
        <p class="mb-4 text-justify">I asked him where he had seen me, and he said, "I saw you in the hospital where you work. I was there for a few weeks, and I saw you several times."</p>
        <p class="mb-4 text-justify">I asked him what he was doing in the hospital, and he said, "I was there for a rest. I have been working very hard, and I needed a change."</p>
        <p class="mb-4 text-justify">I asked him what he did, and he said, "I am a writer. I write stories for magazines."</p>
        <p class="mb-4 text-justify">I asked him what kind of stories he wrote, and he said, "I write detective stories. I have written a great many of them, and they have been very successful."</p>
        <p class="mb-4 text-justify">I asked him if he had ever written a book, and he said, "Yes, I have written several books. They have been very successful, too."</p>
        <p class="mb-4 text-justify">I asked him if he had ever written a book about a doctor, and he said, "No, I have never written a book about a doctor. But I have often thought of writing one."</p>
        <p class="mb-4 text-justify">I asked him if he would like to write a book about a doctor, and he said, "Yes, I would like to write a book about a doctor. But I don't know any doctors."</p>
        <p class="mb-4 text-justify">I said, "I am a doctor. If you would like to write a book about a doctor, I would be glad to help you."</p>
        <p class="mb-4 text-justify">He said, "Thank you. I would like to write a book about a doctor. But I don't know what to write about."</p>
        <p class="mb-4 text-justify">I said, "I can tell you a great many stories about doctors. I have been a doctor for ten years, and I have seen a great many strange things."</p>
        <p class="mb-4 text-justify">He said, "Thank you. I would like to hear some of your stories. But I don't have much time. I have to go now."</p>
        <p class="mb-4 text-justify">I said, "Where are you going?"</p>
        <p class="mb-4 text-justify">He said, "I am going to the West. I am going to write a book about the West."</p>
        <p class="mb-4 text-justify">I said, "I am going to the West, too. I am going to visit my brother. He is a mining engineer, and he has a mine in the West."</p>
        <p class="mb-4 text-justify">He said, "That is very interesting. I would like to see a mine. I have never seen a mine."</p>
        <p class="mb-4 text-justify">I said, "If you would like to see a mine, I can take you to my brother's mine. He would be glad to show you his mine."</p>
        <p class="mb-4 text-justify">He said, "Thank you. I would like to see your brother's mine. But I don't have much time. I have to go now."</p>
        <p class="mb-4 text-justify">I said, "When are you coming back?"</p>
        <p class="mb-4 text-justify">He said, "I am coming back in a few weeks. I will be back in a month."</p>
        <p class="mb-4 text-justify">I said, "When you come back, I would like to see you. I would like to hear some of your stories."</p>
        <p class="mb-4 text-justify">He said, "Thank you. I would like to see you, too. I would like to tell you some of my stories."</p>
        <p class="mb-4 text-justify">I said, "Where can I find you when you come back?"</p>
        <p class="mb-4 text-justify">He said, "You can find me at the hotel. I will be staying at the hotel."</p>
        <p class="mb-4 text-justify">I said, "What is the name of the hotel?"</p>
        <p class="mb-4 text-justify">He said, "The name of the hotel is the Grand Hotel. It is on Main Street."</p>
        <p class="mb-4 text-justify">I said, "Thank you. I will see you when you come back."</p>
        <p class="mb-4 text-justify">He said, "Thank you. I will see you when I come back."</p>
        <p class="mb-4 text-justify">Then he shook my hand and went away. I watched him until he was out of sight, and then I went to my train.</p>
        <p class="mb-4 text-justify">The train was crowded, and I had to stand in the aisle. After a while, a conductor came and told me that there was a seat in the smoking car. I went to the smoking car, and found a seat by the window.</p>
        <p class="mb-4 text-justify">I sat down and looked out of the window. The train was moving fast, and the scenery was flying past. I watched the fields and the houses and the trees, and I thought about the man I had met in the station.</p>
        <p class="mb-4 text-justify">I wondered who he was, and what he was doing in the hospital. I wondered what kind of stories he wrote, and if they were any good. I wondered if he would really write a book about a doctor, and if he would ask me to help him.</p>
        <p class="mb-4 text-justify">I thought about these things for a long time, and then I began to feel sleepy. I leaned back in my seat and closed my eyes, and soon I was fast asleep.</p>
        <p class="mb-4 text-justify">I slept for a long time, and when I woke up, the train was slowing down. I looked out of the window, and saw that we were coming into a station. I gathered my things together, and when the train stopped, I got off.</p>
        <p class="mb-4 text-justify">The station was small, and there were not many people on the platform. I looked around, and then I saw my brother standing by the gate. He waved to me, and I went over to him.</p>
        <p class="mb-4 text-justify">He shook my hand and said, "I'm glad to see you. How was your trip?"</p>
        <p class="mb-4 text-justify">I said, "It was fine. I'm glad to be here."</p>
        <p class="mb-4 text-justify">He said, "Let's get your luggage, and then we'll go to the hotel."</p>
        <p class="mb-4 text-justify">We went to the baggage room, and got my luggage. Then we went out of the station, and got into a carriage. The driver cracked his whip, and we drove away.</p>
        <p class="mb-4 text-justify">We drove through the town, and then out into the country. The road was rough, and the carriage bounced up and down. I held on to the seat, and looked at the scenery.</p>
        <p class="mb-4 text-justify">The country was beautiful. The fields were green, and the trees were tall. The sky was blue, and there were white clouds floating in it.</p>
        <p class="mb-4 text-justify">We drove for a long time, and then we came to a river. There was a bridge over the river, and we drove across it. On the other side of the river, there was a forest.</p>
        <p class="mb-4 text-justify">We drove into the forest, and then we came to a clearing. In the middle of the clearing, there was a house. It was a large house, with a big porch and a lot of windows.</p>
        <p class="mb-4 text-justify">The driver stopped the carriage, and we got out. My brother took my luggage, and we went up to the house. He knocked on the door, and a woman opened it.</p>
        <p class="mb-4 text-justify">She was a tall, thin woman, with a long face and a kind smile. She was dressed in a black dress, and she wore a white apron.</p>
        <p class="mb-4 text-justify">My brother said, "This is my brother, Dr. MacQuarrie. He is going to stay with us for a while."</p>
        <p class="mb-4 text-justify">She said, "I'm glad to meet you, Dr. MacQuarrie. My name is Mrs. Brown. I'm the housekeeper."</p>
        <p class="mb-4 text-justify">I said, "I'm glad to meet you, Mrs. Brown."</p>
        <p class="mb-4 text-justify">She said, "Come in. I'll show you to your room."</p>
        <p class="mb-4 text-justify">We went into the house, and she led us up the stairs. The stairs were wide, and there was a carpet on them. The carpet was red, and it had a pattern of flowers on it.</p>
        <p class="mb-4 text-justify">We went down the hall, and then she stopped at a door. She opened the door, and we went into the room.</p>
        <p class="mb-4 text-justify">It was a large room, with a big bed and a lot of furniture. There was a window in the wall, and there was a view of the forest.</p>
        <p class="mb-4 text-justify">Mrs. Brown said, "This is your room. I hope you like it."</p>
        <p class="mb-4 text-justify">I said, "It's a beautiful room. Thank you."</p>
        <p class="mb-4 text-justify">She said, "Dinner will be ready in an hour. I'll send someone to call you."</p>
        <p class="mb-4 text-justify">She went out, and my brother and I were alone. He put my luggage on the floor, and then he sat down on the bed.</p>
        <p class="mb-4 text-justify">He said, "Well, what do you think of the place?"</p>
        <p class="mb-4 text-justify">I said, "It's beautiful. I've never seen such a beautiful place."</p>
        <p class="mb-4 text-justify">He said, "I'm glad you like it. I think you'll be happy here."</p>
        <p class="mb-4 text-justify">I said, "I'm sure I will. It's a wonderful place."</p>
        <p class="mb-4 text-justify">He said, "I have to go now. I have some work to do. I'll see you at dinner."</p>
        <p class="mb-4 text-justify">He went out, and I was alone. I unpacked my luggage, and then I went to the window. I looked out at the forest, and thought about what had happened to me.</p>
        <p class="mb-4 text-justify">I thought about the man I had met in the station, and I wondered if I would ever see him again. I thought about the stories he wrote, and I wondered if they were any good.</p>
        <p class="mb-4 text-justify">I thought about these things for a long time, and then I went to the bed. I lay down on the bed, and soon I was fast asleep.</p>
        <p class="mb-4 text-justify">When I woke up, it was dark. I got up and went to the window. The moon was shining, and the forest was bathed in its light. I could hear the sound of crickets, and the rustling of leaves in the wind.</p>
        <p class="mb-4 text-justify">I stood there for a long time, just looking at the forest and listening to the sounds of the night. Then I went back to the bed and lay down again. I closed my eyes, but I couldn't sleep. I kept thinking about the man I had met in the station.</p>
        <p class="mb-4 text-justify">I wondered who he was, and what he was doing in the hospital. I wondered what kind of stories he wrote, and if they were any good. I wondered if he would really write a book about a doctor, and if he would ask me to help him.</p>
        <p class="mb-4 text-justify">I thought about these things for a long time, and then I began to feel sleepy again. I closed my eyes, and soon I was fast asleep.</p>
        <p class="mb-4 text-justify">The next morning, I woke up early. The sun was shining, and the birds were singing. I got up and went to the window. The forest was beautiful in the morning light. The trees were green, and the flowers were blooming.</p>
        <p class="mb-4 text-justify">I stood there for a long time, just looking at the forest and listening to the sounds of the morning. Then I went to the closet and got dressed. I put on my best suit, and then I went downstairs.</p>
        <p class="mb-4 text-justify">The dining room was large, with a long table and a lot of chairs. There was a window in the wall, and there was a view of the forest. My brother was sitting at the table, reading a newspaper.</p>
        <p class="mb-4 text-justify">He looked up when I came in, and said, "Good morning. Did you sleep well?"</p>
        <p class="mb-4 text-justify">I said, "Good morning. Yes, I slept very well."</p>
        <p class="mb-4 text-justify">He said, "I'm glad to hear that. Come and sit down. Breakfast is ready."</p>
        <p class="mb-4 text-justify">I went to the table and sat down. Mrs. Brown came in with a tray of food. She put the food on the table, and then she went out.</p>
        <p class="mb-4 text-justify">My brother said, "Help yourself. There's plenty of food."</p>
        <p class="mb-4 text-justify">I helped myself to some food, and then we ate. We didn't talk much. We just ate and looked out the window at the forest.</p>
        <p class="mb-4 text-justify">After breakfast, my brother said, "I have to go to the mine today. Would you like to come with me?"</p>
        <p class="mb-4 text-justify">I said, "Yes, I would like to come with you."</p>
        <p class="mb-4 text-justify">He said, "Good. We'll leave after lunch."</p>
        <p class="mb-4 text-justify">I spent the morning exploring the house. It was a large house, with a lot of rooms. There was a library, a sitting room, a dining room, and a lot of bedrooms. There was also a basement, where the wine was stored.</p>
        <p class="mb-4 text-justify">I spent a lot of time in the library. It was a large room, with a lot of books. There were books on every subject, and I spent hours just looking at them.</p>
        <p class="mb-4 text-justify">After lunch, my brother and I went to the mine. It was a long walk, but the scenery was beautiful. The forest was thick, and there were a lot of animals. I saw deer, squirrels, and birds.</p>
        <p class="mb-4 text-justify">When we got to the mine, my brother showed me around. It was a large mine, with a lot of tunnels. There were a lot of men working, and they were all busy.</p>
        <p class="mb-4 text-justify">My brother introduced me to the foreman, and then he left me to explore. I spent the rest of the afternoon exploring the mine. It was a fascinating place, and I learned a lot about mining.</p>
        <p class="mb-4 text-justify">When we got back to the house, it was dark. We had dinner, and then we went to the library. My brother poured us a glass of wine, and then we sat down and talked.</p>
        <p class="mb-4 text-justify">We talked about the mine, and about the forest. We talked about the house, and about the people who lived there. We talked about a lot of things, and it was a very interesting conversation.</p>
        <p class="mb-4 text-justify">After a while, my brother said, "I'm tired. I think I'll go to bed."</p>
        <p class="mb-4 text-justify">I said, "I'm tired too. I think I'll go to bed too."</p>
        <p class="mb-4 text-justify">We went upstairs, and then we went to our rooms. I got undressed, and then I went to bed. I was asleep as soon as my head hit the pillow.</p>
        <p class="mb-4 text-justify">The next day, I woke up early. The sun was shining, and the birds were singing. I got up and went to the window. The forest was beautiful in the morning light. The trees were green, and the flowers were blooming.</p>
        <p class="mb-4 text-justify">I stood there for a long time, just looking at the forest and listening to the sounds of the morning. Then I went to the closet and got dressed. I put on my best suit, and then I went downstairs.</p>
        <p class="mb-4 text-justify">The dining room was empty. I went to the kitchen, and found Mrs. Brown. She was making breakfast.</p>
        <p class="mb-4 text-justify">She said, "Good morning, Dr. MacQuarrie. Did you sleep well?"</p>
        <p class="mb-4 text-justify">I said, "Good morning, Mrs. Brown. Yes, I slept very well."</p>
        <p class="mb-4 text-justify">She said, "I'm glad to hear that. Breakfast will be ready in a few minutes."</p>
        <p class="mb-4 text-justify">I said, "Thank you, Mrs. Brown."</p>
        <p class="mb-4 text-justify">I went to the dining room and sat down. A few minutes later, Mrs. Brown came in with a tray of food. She put the food on the table, and then she went out.</p>
        <p class="mb-4 text-justify">I ate my breakfast, and then I went to the library. I spent the morning reading, and then I went for a walk in the forest.</p>
        <p class="mb-4 text-justify">When I got back to the house, it was lunchtime. I had lunch, and then I went to the library again. I spent the afternoon reading, and then I went for another walk in the forest.</p>
        <p class="mb-4 text-justify">When I got back to the house, it was dinnertime. I had dinner, and then I went to the library again. I spent the evening reading, and then I went to bed.</p>
        <p class="mb-4 text-justify">The next day, I woke up early. The sun was shining, and the birds were singing. I got up and went to the window. The forest was beautiful in the morning light. The trees were green, and the flowers were blooming.</p>
        <p class="mb-4 text-justify">I stood there for a long time, just looking at the forest and listening to the sounds of the morning. Then I went to the closet and got dressed. I put on my best suit, and then I went downstairs.</p>
        <p class="mb-4 text-justify">The dining room was empty. I went to the kitchen, and found Mrs. Brown. She was making breakfast.</p>
        <p class="mb-4 text-justify">She said, "Good morning, Dr. MacQuarrie. Did you sleep well?"</p>
        <p class="mb-4 text-justify">I said, "Good morning, Mrs. Brown. Yes, I slept very well."</p>
        <p class="mb-4 text-justify">She said, "I'm glad to hear that. Breakfast will be ready in a few minutes."</p>
        <p class="mb-4 text-justify">I said, "Thank you, Mrs. Brown."</p>
        <p class="mb-4 text-justify">I went to the dining room and sat down. A few minutes later, Mrs. Brown came in with a tray of food. She put the food on the table, and then she went out.</p>
        <p class="mb-4 text-justify">I ate my breakfast, and then I went to the library. I spent the morning reading, and then I went for a walk in the forest.</p>
        <p class="mb-4 text-justify">When I got back to the house, it was lunchtime. I had lunch, and then I went to the library again. I spent the afternoon reading, and then I went for another walk in the forest.</p>
        <p class="mb-4 text-justify">When I got back to the house, it was dinnertime. I had dinner, and then I went to the library again. I spent the evening reading, and then I went to bed.</p>
    `;

    useEffect(() => {
        const mockBooks = {
            '1': { title: "The After House", author: "Mary Roberts Rinehart" },
            '2': { title: "Mưa Đỏ", author: "Chu Lai" }
        };
        setBook(mockBooks[id] || mockBooks['1']);
    }, [id]);

    // Hàm để nhận tổng số trang từ ReadingArea
    const handleTotalPagesChange = useCallback((newTotalPages) => {
        setTotalPages(newTotalPages);
    }, []);

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
            setPageChangeTrigger(prev => !prev);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
            setPageChangeTrigger(prev => !prev);
        }
    };
    
    const handleChapterSelect = (page) => {
        setCurrentPage(page);
        setPageChangeTrigger(prev => !prev);
    };

    const handleGoBack = () => {
        navigate(-1);
    };

    const handleToggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
    };

    const handleToggleBookmark = () => {
        console.log('Toggle bookmark');
    };

    const handleToggleMenu = () => {
        setShowSidebar(!showSidebar);
    };

    if (!book) {
        return <div className="flex items-center justify-center h-screen">Đang tải...</div>;
    }

    return (
        <div className={`${isDarkMode ? 'dark' : ''} h-screen flex flex-col ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'} font-serif relative`}>
            <ReaderHeader 
                bookTitle={book.title}
                currentPage={currentPage}
                totalPages={totalPages}
                onGoBack={handleGoBack}
                onToggleDarkMode={handleToggleDarkMode}
                onToggleBookmark={handleToggleBookmark}
                onToggleMenu={handleToggleMenu}
                isDarkMode={isDarkMode}
            />
            <div className="flex flex-1 overflow-hidden relative">
                <div className="flex-grow flex flex-col">
                    <ReadingArea 
                        pageContent={fullContent} 
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPrevPage={handlePrevPage}
                        onNextPage={handleNextPage}
                        isDarkMode={isDarkMode}
                        pageChangeTrigger={pageChangeTrigger}
                        onTotalPagesChange={handleTotalPagesChange} // Truyền callback xuống
                    />
                </div>
                {showSidebar && (
                    <div className="absolute inset-0 z-40">
                        <div className="absolute inset-0 bg-black opacity-50" onClick={() => setShowSidebar(false)}></div>
                        <div className="absolute right-0 top-0 h-full">
                            <TableOfContents 
                                tableOfContents={[
                                    { chapter: "Chapter 1", title: "PLAN A VOYAGE", page: 1 },
                                    { chapter: "Chapter 2", title: "THE YACHT ELLA", page: 5 },
                                    { chapter: "Chapter 3", title: "THE CREW", page: 12 },
                                    { chapter: "Chapter 4", title: "THE FIRST NIGHT", page: 18 },
                                    { chapter: "Chapter 5", title: "THE STRANGE PASSENGER", page: 25 },
                                ]}
                                currentPage={currentPage}
                                onChapterSelect={handleChapterSelect}
                                onClose={() => setShowSidebar(false)}
                                isDarkMode={isDarkMode}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BookReader;
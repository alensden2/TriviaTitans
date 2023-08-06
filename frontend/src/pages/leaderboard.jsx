import { Box, Flex, Image, Text, VStack, Select } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';


function Leaderboard() {
    const [leaderboardData, setLeaderboardData] = useState([]);
    const [selectedgroupteam, setSelectedgroupteam] = useState('team');
    const [selectedgroupcategory, setSelectedgroupcategory] = useState('');
    const [selectedgrouptimeframe, setSelectedgrouptimeframe] = useState('');

    useEffect(() => {
        if (selectedgroupteam === 'team') {
            const requestBody = {
                category: selectedgroupcategory,
                Team: "team1", 
                gameid: '1'
            };
            fetchLeaderboardteam(requestBody);
        } else if (selectedgroupteam === 'individual') {
            const requestBody = {
                category: selectedgroupcategory,
                Team: "team1", 
                gameid: '1'
            };
            fetchLeaderboardind(requestBody);
        }
    }, [selectedgroupteam]);

    const fetchLeaderboardteam = (requestBody) => {
    
        fetch('https://rh6tue7agh.execute-api.us-east-1.amazonaws.com/production/team_score', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(requestBody)
        })
          .then((response) => response.json())
          .then((data) => {
            console.log(data);
            setLeaderboardData(data);
          })
          .catch((error) => console.error('Error fetching data:', error));
    };

    const fetchLeaderboardind = (requestBody) => {
      
          fetch('https://rh6tue7agh.execute-api.us-east-1.amazonaws.com/production/ind_score', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
          })
            .then((response) => response.json())
            .then((data) => {
              console.log(data);
              setLeaderboardData(data);
            })
            .catch((error) => console.error('Error fetching data:', error));
    }
    return (
        <Flex justifyContent="space-around" minH="90vh" backgroundColor="#000C66" w="100%" >
            <Flex w="45%" justifyContent="center">
                <VStack spacing="4" color="white" order={[2, 2, 1]} mb="24px" mt="32px">
                    <Text as="h1" fontSize="5xl" fontWeight="medium" color="white" mb="1">
                        Leaderboard
                    </Text>
                    <Select
                        value={selectedgroupteam}
                        onChange={(e) => setSelectedgroupteam(e.target.value)}
                        color="white"
                        backgroundColor="white"
                        borderRadius="8px"
                        width="200px"
                        padding="8px"
                    >
                        <option value="team">Team</option>
                        <option value="individual">Individual</option>
                    </Select>
                    <Select
                        value={selectedgroupcategory}
                        onChange={(e) => setSelectedgroupcategory(e.target.value)}
                        color="white"
                        backgroundColor="white"
                        borderRadius="8px"
                        width="200px"
                        padding="8px"
                    >
                        <option value="mathematics">Mathematics</option>
                        <option value="science">Science</option>
                    </Select>
                    <Select
                        value={selectedgrouptimeframe}
                        onChange={(e) => setSelectedgrouptimeframe(e.target.value)}
                        color="white"
                        backgroundColor="white"
                        borderRadius="8px"
                        width="200px"
                        padding="8px"
                    >
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                    </Select>
                    {leaderboardData.map((data, index) => (
                        <Box
                            key={data._id}
                            display="flex"
                            alignItems="center"
                            justifyContent="space-between"
                            width="400px"
                            padding="10px"
                            backgroundColor="#0a1c5a"
                            borderRadius="8px"
                            boxShadow="0 2px 4px rgba(0, 0, 0, 0.1)"
                        >
                            <Box fontSize="xl">
                                {index + 1}.
                            </Box>
                            <Box fontWeight="medium">
                                {data.Name}
                            </Box>
                            <Text>{data.Score} points</Text>
                        </Box>
                    ))}

                </VStack>
            </Flex>
            <Flex w="45%" alignItems="center">
            <iframe
                        width="600"
                        height="450"
                        src="https://lookerstudio.google.com/embed/reporting/2c34b313-f909-45c5-bd12-d68bab303df6/page/xa3YD"
                        frameBorder="0"
                        style={{ border: 0 }}
                        allowFullScreen
            ></iframe>
            </Flex>
        </Flex>
    );
}

export default Leaderboard;

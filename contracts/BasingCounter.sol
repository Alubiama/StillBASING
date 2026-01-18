// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract BasingCounter {
    // Mapping от адреса пользователя к количеству кликов
    mapping(address => uint256) public userClicks;

    // Общее количество кликов всех пользователей
    uint256 public totalClicks;

    // Mapping для отслеживания получил ли пользователь NFT за достижение
    mapping(address => mapping(uint256 => bool)) public achievementsClaimed;

    // События
    event Clicked(address indexed user, uint256 newCount, uint256 totalCount);
    event AchievementUnlocked(address indexed user, uint256 milestone);

    // Пороги для NFT достижений
    uint256[] public milestones = [10, 50, 100, 500, 1000];

    // Функция для записи клика
    function recordClick() external {
        userClicks[msg.sender]++;
        totalClicks++;

        emit Clicked(msg.sender, userClicks[msg.sender], totalClicks);

        // Проверяем, разблокировано ли новое достижение
        checkMilestones(msg.sender);
    }

    // Функция для записи нескольких кликов за раз (экономия gas)
    function recordClicks(uint256 count) external {
        require(count > 0 && count <= 100, "Invalid click count");

        userClicks[msg.sender] += count;
        totalClicks += count;

        emit Clicked(msg.sender, userClicks[msg.sender], totalClicks);

        checkMilestones(msg.sender);
    }

    // Проверка достижений
    function checkMilestones(address user) internal {
        uint256 clickCount = userClicks[user];

        for (uint256 i = 0; i < milestones.length; i++) {
            if (clickCount >= milestones[i] && !achievementsClaimed[user][milestones[i]]) {
                achievementsClaimed[user][milestones[i]] = true;
                emit AchievementUnlocked(user, milestones[i]);
            }
        }
    }

    // Получить количество кликов пользователя
    function getUserClicks(address user) external view returns (uint256) {
        return userClicks[user];
    }

    // Получить все разблокированные достижения пользователя
    function getUserAchievements(address user) external view returns (uint256[] memory) {
        uint256 count = 0;

        // Считаем количество разблокированных достижений
        for (uint256 i = 0; i < milestones.length; i++) {
            if (achievementsClaimed[user][milestones[i]]) {
                count++;
            }
        }

        // Создаем массив для хранения разблокированных достижений
        uint256[] memory achievements = new uint256[](count);
        uint256 index = 0;

        for (uint256 i = 0; i < milestones.length; i++) {
            if (achievementsClaimed[user][milestones[i]]) {
                achievements[index] = milestones[i];
                index++;
            }
        }

        return achievements;
    }

    // Получить следующее достижение для пользователя
    function getNextMilestone(address user) external view returns (uint256) {
        uint256 clickCount = userClicks[user];

        for (uint256 i = 0; i < milestones.length; i++) {
            if (clickCount < milestones[i]) {
                return milestones[i];
            }
        }

        return 0; // Все достижения разблокированы
    }
}

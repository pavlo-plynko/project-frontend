package com.game.dto;

import com.game.entity.Player;
import com.game.entity.Profession;
import com.game.entity.Race;

import static java.util.Objects.isNull;

public class PlayerInfo {
    public Long id;
    public String name;
    public String title;
    public Race race;
    public Profession profession;
    public Integer level;
    public Long birthday;
    public Boolean banned;

    public static PlayerInfo toPlayerInfo(Player player) {
        if (isNull(player)) return null;

        PlayerInfo result = new PlayerInfo();
        result.id = player.getId();
        result.name = player.getName();
        result.title = player.getTitle();
        result.race = player.getRace();
        result.profession = player.getProfession();
        result.birthday = player.getBirthday().getTime();
        result.banned = player.getBanned();
        result.level = player.getLevel();
        return result;
    }
}
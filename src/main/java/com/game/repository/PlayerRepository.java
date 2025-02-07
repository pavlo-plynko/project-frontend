package com.game.repository;

import com.game.entity.Player;
import com.game.entity.Profession;
import com.game.entity.Race;
import org.springframework.stereotype.Repository;

import java.util.Comparator;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.stream.Collectors;

@Repository
public class PlayerRepository {
    private static final List<Player> storage = new CopyOnWriteArrayList<Player>() {{
        add(new Player(1L, "Nius", "Bamboozle", Race.HOBBIT, Profession.ROGUE, new Date(1244497480000L), false, 33));
        add(new Player(2L, "Nikrash", "BumbleBeast", Race.ORC, Profession.WARRIOR, new Date(1152424240000L), false, 58));
        add(new Player(4L, "Essel", "Pyrogue", Race.DWARF, Profession.CLERIC, new Date(1243201400000L), true, 3));
        add(new Player(5L, "Bolan", "Lassassin", Race.DWARF, Profession.ROGUE, new Date(1241378440000L), true, 29));
        add(new Player(6L, "Eleonor", "CleverStork", Race.HUMAN, Profession.SORCERER, new Date(1214155000000L), true, 35));
        add(new Player(7L, "Eman", "VainBlizzard", Race.ELF, Profession.SORCERER, new Date(1214772360000L), false, 56));
        add(new Player(8L, "Talan", "MysteriousWillow", Race.GIANT, Profession.ROGUE, new Date(1217853300000L), false, 36));
        add(new Player(9L, "Arilan", "DefiantNewt", Race.ELF, Profession.SORCERER, new Date(1216022000000L), false, 34));
        add(new Player(10L, "Derakt", "SereneLlama", Race.ELF, Profession.WARLOCK, new Date(1215043720000L), false, 55));
        add(new Player(12L, "Arhill", "SpringLord", Race.GIANT, Profession.PALADIN, new Date(1243141000000L), false, 38));
        add(new Player(13L, "Endarion", "Badgericho", Race.ELF, Profession.DRUID, new Date(1219611120000L), false, 45));
        add(new Player(17L, "Firewin", "Soyster", Race.HUMAN, Profession.NAZGUL, new Date(1216967280000L), false, 12));
        add(new Player(18L, "Haridin", "Vipersia", Race.TROLL, Profession.WARRIOR, new Date(1211454600000L), false, 47));
        add(new Player(19L, "Djur", "Pixelephant", Race.ORC, Profession.DRUID, new Date(1211860680000L), false, 23));
        add(new Player(20L, "Gron", "CornyAssassin", Race.GIANT, Profession.PALADIN, new Date(1218401160000L), false, 58));
        add(new Player(21L, "Morviel", "FalsePumpkin", Race.ELF, Profession.CLERIC, new Date(1244696560000L), false, 31));
        add(new Player(22L, "Nufis", "JealousEnigma", Race.HUMAN, Profession.ROGUE, new Date(1214556360000L), false, 56));
        add(new Player(25L, "Yurh", "FlamboyantTiger", Race.TROLL, Profession.WARRIOR, new Date(1244687920000L), true, 51));
        add(new Player(26L, "Blake", "LonelyDefender", Race.HUMAN, Profession.ROGUE, new Date(1242512800000L), false, 54));
        add(new Player(27L, "Ness", "MysteriousArrow", Race.TROLL, Profession.WARRIOR, new Date(1216022000000L), true, 35));
        add(new Player(28L, "Ferin", "Orangutango", Race.TROLL, Profession.WARRIOR, new Date(1216582000000L), false, 48));
        add(new Player(29L, "Solkah", "Unbanshee", Race.ELF, Profession.SORCERER, new Date(1211843400000L), false, 54));
        add(new Player(30L, "Schink", "Phantomato", Race.GIANT, Profession.WARLOCK, new Date(1216315760000L), true, 41));
        add(new Player(32L, "Aysha", "Plazy", Race.HUMAN, Profession.CLERIC, new Date(1217761800000L), false, 45));
        add(new Player(33L, "Tant", "BladeTumbler", Race.DWARF, Profession.PALADIN, new Date(1214741200000L), false, 25));
        add(new Player(34L, "Trenigan", "HiddenProphet", Race.ELF, Profession.SORCERER, new Date(1216020000000L), false, 42));
        add(new Player(35L, "Woody", "JellyGoose", Race.TROLL, Profession.NAZGUL, new Date(1210163720000L), false, 42));
        add(new Player(36L, "Camirazh", "UncleFroglet", Race.DWARF, Profession.CLERIC, new Date(1216454000000L), true, 39));
        add(new Player(41L, "Larkin", "FeistyWallaby", Race.HOBBIT, Profession.CLERIC, new Date(1219740720000L), false, 46));
        add(new Player(42L, "Zandir", "BrownFury", Race.ELF, Profession.WARRIOR, new Date(1214850120000L), false, 23));
        add(new Player(43L, "Balgor", "Sniperv", Race.ORC, Profession.NAZGUL, new Date(1211597960000L), false, 18));
        add(new Player(44L, "Regarn", "TerrificMaple", Race.GIANT, Profession.WARRIOR, new Date(1197692680000L), false, 53));
        add(new Player(45L, "Anjela", "PrettyDiva", Race.DWARF, Profession.WARRIOR, new Date(1247890000000L), false, 33));
        add(new Player(23L, "Jeris", "MadZombie", Race.ORC, Profession.WARRIOR, new Date(1216630320000L), false, 58));
        add(new Player(46L, "Jack", "PeaceChamp", Race.GIANT, Profession.WARRIOR, new Date(1214879560000L), false, 3));
        add(new Player(47L, "Philliel", "ChillPumpkin", Race.ELF, Profession.WARRIOR, new Date(1244445640000L), false, 30));
        add(new Player(48L, "Yara", "ProudKiwi", Race.HUMAN, Profession.CLERIC, new Date(1241309300000L), false, 52));
        add(new Player(49L, "Illinas", "Sincubus", Race.HOBBIT, Profession.WARRIOR, new Date(1240834120000L), false, 47));
        add(new Player(50L, "Ardong", "Eliminature", Race.HUMAN, Profession.WARRIOR, new Date(1217537160000L), false, 21));
        add(new Player(52L, "Attiris", "Slotherworldly", Race.ELF, Profession.SORCERER, new Date(1245050800000L), true, 34));
    }};

    public List<Player> getAll(int pageNumber, int pageSize) {
        return storage.stream()
                .sorted(Comparator.comparingLong(Player::getId))
                .skip(pageNumber == 0 ? 0:(long) (pageNumber) * pageSize)
                .limit(pageSize)
                .collect(Collectors.toList());
    }

    public int getAllCount() {
        return storage.size();
    }

    public Player save(Player player) {
        player.setId(getMaxId() + 1);
        storage.add(player);
        return player;
    }

    public Player update(Player updatedPlayer) {
        Player searchedPlayer = findById(updatedPlayer.getId()).orElse(null);
        if(searchedPlayer == null){
            throw new IllegalArgumentException("Player not found with id: " + updatedPlayer.getId());
        }
        int listIndex = storage.indexOf(searchedPlayer);
        storage.set(listIndex, updatedPlayer);
        return updatedPlayer;
    }

    public Optional<Player> findById(long id) {
        return storage.stream().filter(player -> id == player.getId()).findFirst();
    }

    public void delete(Player player) {
        storage.remove(player);
    }

    private long getMaxId() {
        return storage.stream()
                .map(Player::getId)
                .max(Long::compareTo)
                .orElse(1L);
    }
}
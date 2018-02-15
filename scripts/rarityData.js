function Rarity(name, multi, variance, aWidth) {
    this.name = name;
    this.multiplier = multi;
    this.colorVariance = variance;
    this.auraWidth = aWidth;
    this.auraColors = [];
}

var raritys = {};

raritys.trash = new Rarity("Trash", 0.1, 0, 0);

raritys.trash.auraColors[0] = new Color(0, 0, 0, 255);

raritys.common = new Rarity("Common", 0.5, 10, 0);

raritys.common.auraColors[0] = new Color(0, 0, 0, 255);

raritys.uncommon = new Rarity("Uncommon", 1, 20, 2);

raritys.uncommon.auraColors[0] = new Color(0, 0, 255, 255);

raritys.rare = new Rarity("Rare", 2, 40, 3);

raritys.rare.auraColors[0] = new Color(255, 122, 0, 255);

raritys.uRare = new Rarity("Ultra Rare", 5, 60, 5);

raritys.uRare.auraColors[0] = new Color(45, 0, 255, 255);

raritys.Legendary = new Rarity("Legendary", 10, 80, 13);

raritys.Legendary.auraColors[0] = new Color(100, 0, 0, 255);
raritys.Legendary.auraColors[1] = new Color(0, 0, 0, 255);

raritys.uLegendary = new Rarity("Ultra Legendary", 100, 150, 15);

raritys.uLegendary.auraColors[0] = new Color(148, 0, 211, 255);
raritys.uLegendary.auraColors[1] = new Color(75, 0, 130, 255);
raritys.uLegendary.auraColors[2] = new Color(0, 0, 255, 255);
raritys.uLegendary.auraColors[3] = new Color(0, 255, 0, 255);
raritys.uLegendary.auraColors[4] = new Color(255, 255, 0, 255);
raritys.uLegendary.auraColors[5] = new Color(255, 127, 0, 255);
raritys.uLegendary.auraColors[6] = new Color(255, 0 , 0, 255);
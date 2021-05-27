library(readr)
library(dplyr)
library(jsonlite)

# stáhni a rozbal výsledky v okrscích

getData <- function(url) {
  download.file(url, "./../data/data.zip")
  unzip("./../data/data.zip", exdir="./../data")
  file.remove("./../data/data.zip")
}

getData("https://volby.cz/opendata/ps2017nss/PS2017data20171122_csv.zip")
getData("https://volby.cz/opendata/ps2017nss/PS2017reg20171122_csv.zip")
getData("https://volby.cz/opendata/ps2017nss/PS2017ciselniky20170905_csv.zip")

# načti výsledky v okrscích a strany

okrsky <- read_csv2("./../data/pst4.csv")
vysledky <- read_csv2("./../data/pst4p.csv")
obce <- read_csv2("./../data/pscoco.csv", locale = locale(encoding = "cp1250"))


vysledky <- vysledky %>%
  left_join(okrsky, by=c("ID_OKRSKY")) %>%
  select(ODEVZ_OBAL, ID_OKRSKY, OKRES.x, OBEC.x, OKRSEK.x, KSTRANA, POC_HLASU, PL_HL_CELK )

strany <- read_csv2("./../data/psrkl.csv", locale = locale(encoding = "cp1250"))
strany_vybrane <- strany[strany$KSTRANA %in% c(21,1,15,29,7,8,4,24,20,7), ]

# je vítěz?

vysledky <- vysledky %>% group_by(ID_OKRSKY) %>%
  mutate(vitez=max(POC_HLASU)) %>%
  mutate(JE_VITEZ=vitez==POC_HLASU)


# jen okrsky, kde zvítězila některá z parlamentních stran

vysledky <- vysledky %>%
  filter(KSTRANA %in% strany_vybrane$KSTRANA) %>%
  filter(JE_VITEZ==T) %>%
  filter(OBEC.x!=999997) %>%
  mutate(HL_PCT=POC_HLASU/PL_HL_CELK) %>%
  arrange(desc(HL_PCT))

# pro každou stranu top 100 okrsků

export <- vysledky %>%
  group_by(KSTRANA) %>%
  slice_max(HL_PCT, n=50)


# přidej název obce

export <- export %>%
  left_join(obce, by=c("OBEC.x" = "OBEC"))

# načti souřadnice

souradnice <- read_csv("./../data/souradnice.csv")

#přidej souřadnice

export <- export %>%
  left_join(souradnice, by=c("OBEC_PREZ"= "ObecKod", "OKRSEK.x" = "Cislo"))

# vyber sloupce a udělej json

export %>%
  select(str=KSTRANA, hl=POC_HLASU, hlclk=PL_HL_CELK, obc=NAZEVOBCE, X, Y, okr=OKRSEK.x) %>%
  toJSON() %>%
  write_file("./../data/data.json")

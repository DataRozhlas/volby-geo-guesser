library(readr)
library(lubridate)
library(dplyr)
library(jsonlite)

results <- read_csv("../data/results.csv")


uspesnost <- c(rep(0, 31), rep(10, 148), rep(20,339), rep(30, 645), rep(40, 799), rep(50,702), rep(60, 524), rep(70, 246), rep(80, 66), rep(90, 12), rep(100,2) )

mean(uspesnost)


results$time <- as_datetime(results$tstamp/1000)

results_clean <- results %>%
  filter(time>as_date("2021-06-23")) %>%
  select(id, correct, tip, time, uid)

sum(is.na(results_clean$tip))

results_clean$correct2 <-as.logical(results_clean$correct)

table(results_clean$correct2)

places  <- fromJSON("../data/data.json")

okresy <-  read_csv2("./../data/cnumnuts.csv", locale = locale(encoding = "cp1250")) %>% select(okres=NUMNUTS, NAZEVNUTS)

strany <- read_csv2("./../data/psrkl.csv", locale = locale(encoding = "cp1250"))
strany_vybrane <- strany[strany$KSTRANA %in% c(21, 1, 15, 29, 7, 8, 4, 24, 20, 7), ] %>% select(str=KSTRANA, ZKRATKAK8)


spojene <- results_clean %>%
  left_join(places) %>%
  left_join(okresy) %>%
  left_join(strany_vybrane)


#top 5

vysledek <- spojene %>%
  group_by(id) %>%
  add_count() %>%
  add_tally(correct2==TRUE) %>%
  group_by(id, ZKRATKAK8, str, obc, NAZEVNUTS, n, nn, hl, hlclk, okr, X, Y) %>%
  summarise() %>%
  mutate(usp=nn/n*100) %>%
  group_by(str) %>%
  slice_max(order_by = usp, n=5)




toJSON(vysledek)

#bottom 5

vysledek <-  spojene %>%
  group_by(id) %>%
  add_count() %>%
  add_tally(correct2==TRUE) %>%
  group_by(id, ZKRATKAK8, str, obc, NAZEVNUTS, n, nn, hl, hlclk, okr, X, Y) %>%
  summarise() %>%
  mutate(usp=nn/n*100) %>%
  group_by(str) %>%
  filter(usp>0) %>%
  filter(nn>1) %>%
  slice_min(order_by = usp, n=5)


tipy <- numeric()

for (i in vysledek$id) {
 result <- spojene %>%
    filter(id==i) %>%
   filter(correct2==F) %>%
     group_by(tip) %>%
    summarise(celkem=n()) %>%
    filter(!is.na(tip)) %>%
    slice_max(order_by=celkem, n=1) %>%
    select(tip) %>%
    slice(1)
 tipy  <- append(tipy, unlist(result[1,1]))
}

tipy<- data.frame(str=tipy) %>%
  left_join(strany_vybrane) %>%
  select(tip=ZKRATKAK8)

vysledek <- cbind(vysledek, tipy)


toJSON(vysledek)



kresli <- vysledek %>%
  filter(str==4)

plot(kresli$hl/kresli$hlclk, kresli$nn/kresli$n)  

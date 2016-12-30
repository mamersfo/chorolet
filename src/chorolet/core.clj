(ns chorolet.core
  (:require [cheshire.core :refer :all]
            [clojure.java.io :as io]
            [clojure.data.csv :as csv]))

(def GIS_FILE "data/nlgis_1982.json")

(def TK_FILE  "data/TK1982.csv")

(def PROPS   ["AmsterdamseCode"
              ;; "GeldigeStemmen"
              ;; "Kiesgerechtigden"
              ;; "OngeldigeBlancoStemmen"
              ;; "Opkomst"
              ])

(def PARTIES [" Werk en Maatschappij"
              "CDA"
              "CP"
              "CPN"
              "D66"
              "DS70"
              "Evangelische Volkspartij"
              "GPV"
              "God Met Ons"
              "NVU"
              "PPR"
              "PSP"
              "Progressieve Partij voor Behoud van Milieu"
              "PvdA"
              "RPF"
              "Rechtse Volkspartij"
              "Rooms Katholieke Partij Nederland"
              "SGP"
              "SP"
              "VVD"])

(defn read-json [f]
  (parse-string (slurp f) true))

(defn read-csv [f]
  (with-open [in-file (io/reader f)]
    (doall
     (csv/read-csv in-file))))

(defn parse-int [s]
  (try
    (Integer/parseInt s)
    (catch Exception e s)))

(defn read-tk []
  (let [csv (read-csv TK_FILE)
        rows (map #(map parse-int %) (rest csv))
        cols (first csv)]
    (for [m (map (partial zipmap cols) rows)
          :let [results (select-keys m PARTIES)
                largest (first (apply max-key val results)) 
                props (select-keys m PROPS)]]
      (assoc props "grootste" largest))))

(defn idx-tk [coll k]
  (reduce
   (fn [m n]
     (let [key (get n k)]
       (assoc m key (dissoc n k)))) {} coll))

(defn enhance-json []
  (let [idx (idx-tk (read-tk) "AmsterdamseCode")
        json (read-json GIS_FILE)]
    (assoc json :features
           (for [f (:features json)
                 :let [props (:properties f)
                       found (get idx (:amsterdamcode props))]]
             (assoc f :properties (merge props found))))))

(defn write-json
  [root filename]
  (let [path (str "data/" filename)]
    (with-open [out (clojure.java.io/writer path)]
      (generate-stream root out {:pretty false})
      (println "Written to" path))))


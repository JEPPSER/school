#ifndef MAINWINDOW_H
#define MAINWINDOW_H

#include <QMainWindow>
#include <QLabel>
#include <QHBoxLayout>
#include <QChartView>

#include "mapscene.h"
#include "mapview.h"

QT_CHARTS_USE_NAMESPACE

struct observation {
    QString station;
    int year;
    int month;
    qreal temp;
    int number;
};

struct station {
    QString id;
    qreal latitude;
    qreal longitude;
    qreal elevation;
    QString countryCode;
    QString name;
    int yearFirst;
    int yearLast;
    QHash<int, qreal> averages;
};

class MainWindow : public QMainWindow
{
    Q_OBJECT

public:
    MainWindow(QWidget *parent = nullptr);
    ~MainWindow();

private slots:
    void yearChanged(int year);
    void monthChanged(int month);
    void selectionChanged();

private:
    QPointF coordinatesToPixel(qreal lat, qreal lon);
    void loadMap();
    void initSliders(int minYear, int maxYear);
    void initLinecharts();
    void clearLayout(QLayout *layout);

    MapScene *Scene;
    MapView *View;

    int year;
    int month;
    qreal minTemp = 1000;
    qreal maxTemp = -1000;
    int minYear = 3000;
    int maxYear = 0;

    QPixmap map;
    qreal scale;
    QHash<QString, station> stations;
    QList<observation> observations;
    QLabel *yText2;
    QLabel *mText2;
    const QList<QString> MONTHS = { "NULL", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" };
    QBoxLayout *vbox;
    QHBoxLayout *chartsLayout;
};
#endif // MAINWINDOW_H

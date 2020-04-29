#ifndef MAINWINDOW_H
#define MAINWINDOW_H

#include <QMainWindow>
#include <QLabel>

#include "mapscene.h"
#include "mapview.h"

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

private:
    QPointF coordinatesToPixel(qreal lat, qreal lon);
    void loadMap();

    MapScene *Scene;
    MapView *View;

    int year;
    int month;

    QPixmap map;
    qreal scale;
    QHash<QString, station> stations;
    QList<observation> observations;
    QLabel *yText2;
    QLabel *mText2;
    const QList<QString> MONTHS = { "NULL", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" };
};
#endif // MAINWINDOW_H

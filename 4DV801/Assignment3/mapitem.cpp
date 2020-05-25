#include "mapitem.h"

#include <QDebug>

MapItem::MapItem(QGraphicsItem *parent) : QGraphicsObject(parent)
{
}

MapItem::MapItem(qreal x, qreal y, int size, QGraphicsItem *parent)
    : QGraphicsObject(parent)
{
    shape << QPointF(x, y) << QPointF(x + size, y) << QPointF(x + size, y + size) << QPointF(x, y + size);
    setFlags(ItemIsSelectable);
}

QRectF MapItem::boundingRect() const
{
    return shape.boundingRect();
}

void MapItem::paint(QPainter *painter, const QStyleOptionGraphicsItem *option, QWidget *widget)
{
    Q_UNUSED(option);
    Q_UNUSED(widget);

    if (isSelected()) {
        painter->setBrush(Qt::blue);
        painter->drawRect(boundingRect().x() - 3, boundingRect().y() - 3, boundingRect().width() + 6, boundingRect().height() + 6);
    }

    painter->setBrush(color);
    painter->drawRect(boundingRect().x(), boundingRect().y(), boundingRect().width(), boundingRect().height());

    if (!hover) return;

    qreal x = boundingRect().x() - 100;
    qreal y = boundingRect().y() - 80;

    painter->setBrush(Qt::black);
    painter->fillRect(x, y, 200, 70, Qt::OddEvenFill);
    painter->setPen(Qt::white);
    painter->drawText(x + 10, y + 15, name);
    painter->drawText(x + 10, y + 30, QString::number(temp) + " °C");
    painter->drawText(x + 10, y + 45, QString::number(elevation) + " meters");
    painter->drawText(x + 10, y + 60, QString::number(latitude) + ", " + QString::number(longitude));
}
